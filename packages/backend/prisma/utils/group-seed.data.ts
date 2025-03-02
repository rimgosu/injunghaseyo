import { PrismaClient } from '@prisma/client';
import { ProofMethodSeedInput, UserWithJoinRole } from './types';

export class GroupSeedData {
  constructor(
    private readonly id: number,
    private readonly price: number,
    private readonly title: string,
    private readonly description: string,
    private readonly tag: string,
    private readonly proofMethods: ProofMethodSeedInput[],
    private readonly dates: string[],
  ) {}

  /**
   * @description 그룹 및 그룹 날짜 데이터 생성
   */
  async createGroupSeedData(prisma: PrismaClient, users: UserWithJoinRole[]) {
    return await prisma.$transaction(async (tx) => {
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
          return await tx.groupDate.update({
            where: {
              id: d.id,
            },
            data: {
              date: this.dates[index],
            },
          });
        }),
      );

      return {
        group,
        groupDate,
      };
    });
  }
}
