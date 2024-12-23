import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { JoinRole, Tag, User } from '@prisma/client';
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

  async createGroup(user: User, params: CreateGroupParams) {
    const { dates, price, proofMethod, tags, title, description } = params;

    const allTags = await this.createTags(tags);

    return await this.prisma.group.create({
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
