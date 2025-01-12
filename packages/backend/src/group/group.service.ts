import { PrismaService } from '@/prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JoinRole, Tag, User, WalletHistoryReason } from '@prisma/client';
import { CreateGroupParams } from './dtos/create-group-params.dto';
import { GetTagsParams } from './dtos/get-tags-param.dto';
import { GetTagsRes } from './dtos/get-tags-res.dto';

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

  async getTags(param: GetTagsParams): Promise<GetTagsRes> {
    const { tagSearch, selectedTags } = param;

    const tags = await this.prisma.tag.findMany({
      where: {
        NOT: {
          name: { in: selectedTags },
        },
      },
    });

    return new GetTagsRes(tags, tagSearch);
  }

  /**
   * @description 모임 생성
   *
   * - 태그, 참여, 모임 생성
   * - 인증 머니 차감, 인증 머니 사용 기록 생성
   */
  async createGroup(user: User, params: CreateGroupParams) {
    const { dates, price, proofMethod, tags, title, description } = params;

    const allTags = await this.createTags(tags);

    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: user.id, deletedAt: null },
    });

    if (wallet?.money < price)
      throw new ForbiddenException('잔액이 부족합니다.');

    return await this.prisma.$transaction(async (tx) => {
      const group = await tx.group.create({
        data: {
          title,
          price,
          description,
          proofMethod,
          join: {
            create: {
              userId: user.id,
              joinRole: JoinRole.HOST,
            },
          },
          groupTagMap: {
            createMany: {
              data: allTags.map((tag) => {
                return { tagId: tag.id };
              }),
            },
          },
          groupDate: {
            createMany: {
              data: dates.map((date) => {
                return { date };
              }),
            },
          },
        },
        select: {
          id: true,
          title: true,
          price: true,
          description: true,
          proofMethod: true,
          groupTagMap: {
            select: {
              tag: {
                select: {
                  name: true,
                },
              },
            },
          },
          groupDate: {
            select: {
              date: true,
            },
          },
          join: {
            select: {
              id: true,
              joinRole: true,
            },
            take: 1,
          },
        },
      });

      const updatedWallet = await tx.wallet.update({
        where: { userId: user.id, deletedAt: null },
        data: {
          money: { decrement: price },
          walletHistory: {
            create: {
              previousMoney: wallet.money,
              currentMoney: wallet.money - price,
              reason: WalletHistoryReason.JOIN,
              joinId: group.join[0].id,
            },
          },
        },
      });

      return {
        group,
        wallet: updatedWallet,
      };
    });
  }

  private async createTags(tags: string[]): Promise<Tag[]> {
    const existingTags = await this.prisma.tag.findMany({
      where: {
        name: {
          in: tags,
        },
        deletedAt: null,
      },
    });

    const existingNames = existingTags.map((tag) => tag.name);
    const newTagNames = tags.filter((tag) => !existingNames.includes(tag));

    const newTags = await Promise.all(
      newTagNames.map(async (name) =>
        this.prisma.tag.create({
          data: { name },
        }),
      ),
    );

    const allTags = [...existingTags, ...newTags];

    return allTags;
  }
}
