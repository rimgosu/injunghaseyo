import {
  GroupDate,
  GroupProgress,
  GroupProgressStatus,
  PrismaClient,
} from '@prisma/client';
import {
  GroupWithGroupDate,
  ProofMethodSeedInput,
  UserWithJoinRole,
} from './types';

export class GroupSeedData {
  constructor(
    private readonly id: number,
    private readonly price: number,
    private readonly title: string,
    private readonly description: string,
    private readonly tag: string,
    private readonly proofMethods: ProofMethodSeedInput[],
    private readonly dates: string[],
    private readonly prisma: PrismaClient,
  ) {}

  private group: GroupWithGroupDate;
  private groupDate: GroupDate[];
  private createdGroupProgresses: GroupProgress[];

  /**
   * @description 그룹 및 그룹 날짜 데이터 생성
   */
  async createGroupSeedData(users: UserWithJoinRole[]) {
    return await this.prisma.$transaction(async (tx) => {
      const group = await tx.group.upsert({
        where: {
          id: this.id,
        },
        update: {},
        create: {
          id: this.id,
          price: this.price,
          title: this.title,
          description: this.description,
          join: {
            createMany: {
              data: users.map((u) => {
                return {
                  userId: u.id,
                  joinRole: u.joinRole,
                };
              }),
            },
          },
          groupTagMap: {
            create: {
              tag: {
                connect: {
                  name: this.tag,
                },
              },
            },
          },
          proofMethod: {
            createMany: {
              data: this.proofMethods.map((method) => ({
                ...method,
              })),
            },
          },
          groupDate: {
            createMany: {
              data: this.dates.map((date) => ({ date })),
            },
          },
        },
        include: {
          groupDate: true,
        },
      });

      // groupDate seed 시점에 따라 업데이트
      const groupDate = await Promise.all(
        group.groupDate.map(async (d, index) => {
          return await this.prisma.groupDate.update({
            where: {
              id: d.id,
            },
            data: {
              date: this.dates[index],
            },
          });
        }),
      );

      // groupProgress bulk create
      const [joins, proofMethods] = await Promise.all([
        this.prisma.join.findMany({
          where: {
            groupId: group.id,
          },
        }),
        this.prisma.proofMethod.findMany({
          where: {
            groupId: group.id,
          },
        }),
      ]);

      const createdGroupProgresses = await Promise.all(
        joins.flatMap((join) =>
          groupDate.flatMap((date) =>
            proofMethods.map((method) =>
              this.prisma.groupProgress.create({
                data: {
                  joinId: join.id,
                  groupDateId: date.id,
                  proofMethodId: method.id,
                  status: GroupProgressStatus.PENDING,
                },
              }),
            ),
          ),
        ),
      );

      this.group = group;
      this.groupDate = groupDate;
      this.createdGroupProgresses = createdGroupProgresses;

      return {
        group,
        groupDate,
        createdGroupProgresses,
      };
    });
  }

  async createProof() {}
}
