import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  GroupProgressStatus,
  Join,
  JoinRole,
  Tag,
  User,
  WalletHistoryReason,
} from '@prisma/client';
import { CreateGroupParams } from './dtos/create-group-params.dto';
import { GetTagsParams } from './dtos/get-tags-param.dto';
import { GetTagsRes } from './dtos/get-tags-res.dto';
import { JoinGroupParam } from './dtos/join-group-param.dto';
import { GROUP_WITH_INCLUDE, GroupWith } from './utils/types';
import { GetGroupsRes } from './dtos/get-groups-res.dto';
import {
  canRefund,
  getFirstDay,
  getLastDayNight,
  isValidGroup,
  validateGroupDates,
} from './utils/utils';
import { GetGroupParam } from './dtos/get-group-param.dto';
import { GetGroupRes } from './dtos/get-group-res.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { LeaveGroupParam } from './dtos/leave-group-param.dto';

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @description 모임 탈퇴
   */
  async leaveGroup(user: User, param: LeaveGroupParam) {
    const { groupId } = param;

    const [group, join, wallet] = await Promise.all([
      this.prisma.group.findUnique({
        where: { id: groupId, deletedAt: null },
        include: {
          join: true,
          groupDate: true,
        },
      }),
      this.prisma.join.findFirst({
        where: { userId: user.id, groupId, deletedAt: null },
      }),
      this.prisma.wallet.findUnique({
        where: { userId: user.id, deletedAt: null },
      }),
    ]);

    if (!group) throw new NotFoundException('모임이 존재하지 않습니다.');
    if (!join) throw new NotFoundException('참여자가 존재하지 않습니다.');
    if (!wallet) throw new NotFoundException('지갑이 존재하지 않습니다.');
    if (
      !canRefund(
        join.createdAt,
        group.groupDate.map((date) => date.date),
      )
    )
      throw new ForbiddenException('환불할 수 없는 모임입니다.');

    return await this.prisma.$transaction(async (tx) => {
      const deletedJoin = await tx.join.delete({
        where: { id: join.id, deletedAt: null },
        include: {
          groupProgress: true,
        },
      });

      const updatedWallet = await tx.wallet.update({
        where: { userId: user.id, deletedAt: null },
        data: {
          money: { increment: group.price },
          walletHistory: {
            create: {
              previousMoney: wallet.money,
              currentMoney: wallet.money + group.price,
              reason: WalletHistoryReason.REFUND,
              joinId: group.join[0].id,
            },
          },
        },
      });

      // 참여자 1명일 경우 모임 삭제
      const deletedGroup =
        group.join.length <= 1 &&
        (await tx.group.delete({
          where: { id: groupId },
          include: {
            groupTagMap: true,
            proofMethod: true,
            groupDate: true,
          },
        }));

      return {
        deletedJoin,
        deletedGroup,
        updatedWallet,
      };
    });
  }

  /**
   * @description 모임 상세 조회
   */
  async getGroup(
    param: GetGroupParam,
    user: User | undefined,
  ): Promise<GetGroupRes> {
    const { groupId } = param;

    const group = await this.prisma.group.findUnique({
      where: { id: groupId, deletedAt: null },
      ...GROUP_WITH_INCLUDE,
    });

    if (!group) throw new NotFoundException('모임이 존재하지 않습니다.');

    return new GetGroupRes(group, user);
  }

  /**
   * @description 모임 전체 조회
   */
  async getGroups(user: User | undefined): Promise<GetGroupsRes> {
    const groups: GroupWith[] = await this.prisma.group.findMany({
      where: { deletedAt: null },
      ...GROUP_WITH_INCLUDE,
    });

    const validGroups = groups.filter((gr) => {
      const lastDayNight = getLastDayNight(gr.groupDate);
      return isValidGroup(lastDayNight);
    });

    return new GetGroupsRes(validGroups, user);
  }

  /**
   * @description 모임 참여
   */
  async joinGroup(user: User, param: JoinGroupParam) {
    const { groupId } = param;

    const [group, wallet, join] = await Promise.all([
      this.prisma.group.findUnique({
        where: {
          id: groupId,
          deletedAt: null,
        },
        include: {
          groupDate: true,
          proofMethod: true,
        },
      }),
      this.prisma.wallet.findUnique({
        where: { userId: user.id, deletedAt: null },
      }),
      this.prisma.join.findFirst({
        where: {
          userId: user.id,
          groupId,
          deletedAt: null,
        },
      }),
    ]);

    const lastDayNight = getLastDayNight(group?.groupDate || []);

    if (!group || !isValidGroup(lastDayNight))
      throw new NotFoundException('모임이 존재하지 않습니다.');

    if (wallet?.money < group.price)
      throw new ForbiddenException('잔액이 부족합니다.');

    if (join) throw new ForbiddenException('이미 참여한 모임입니다.');

    return await this.prisma.$transaction(async (tx) => {
      const join = await tx.join.create({
        data: {
          userId: user.id,
          groupId,
          joinRole: JoinRole.ATTENDEE,
        },
        select: {
          id: true,
        },
      });

      const groupProgressData = group.groupDate.flatMap((date) =>
        group.proofMethod.map((method) => ({
          groupDateId: date.id,
          joinId: join.id,
          proofMethodId: method.id,
          status: GroupProgressStatus.PENDING,
        })),
      );

      await tx.groupProgress.createMany({
        data: groupProgressData,
      });

      const updatedWallet = await tx.wallet.update({
        where: { userId: user.id, deletedAt: null },
        data: {
          money: { decrement: group.price },
          walletHistory: {
            create: {
              previousMoney: wallet.money,
              currentMoney: wallet.money - group.price,
              reason: WalletHistoryReason.JOIN,
              joinId: join.id,
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
    const { dates, price, proofMethods, tags, title, description } = params;

    if (!validateGroupDates(dates))
      throw new ForbiddenException('최소 3일 전에 모임을 생성해야 합니다.');

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
          proofMethod: {
            createMany: {
              data: proofMethods.map((method) => {
                return { method };
              }),
            },
          },
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
          proofMethod: {
            select: {
              id: true,
              method: true,
            },
          },
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
              id: true,
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

      // 각 날짜, 인증방법, 참여자(호스트)에 대해 GroupProgress 생성
      const groupProgressData = group.groupDate.flatMap((date) =>
        group.proofMethod.map((method) => ({
          groupDateId: date.id,
          joinId: group.join[0].id,
          proofMethodId: method.id,
          status: GroupProgressStatus.PENDING,
        })),
      );

      await tx.groupProgress.createMany({
        data: groupProgressData,
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
