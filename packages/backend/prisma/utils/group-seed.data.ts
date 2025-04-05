import { GroupProgressStatus, PrismaClient, ProofType } from '@prisma/client';
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
    private readonly prisma: PrismaClient,
  ) {}

  /**
   * @description 그룹 및 그룹 날짜 데이터 생성
   */
  async createGroupSeedData(users: UserWithJoinRole[]) {
    const group = await this.prisma.group.upsert({
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

    return {
      group,
      groupDate,
      createdGroupProgresses,
    };
  }

  /**
   * @description 그룹 인증 데이터 생성
   */
  async createProof() {
    const group = await this.prisma.group.findUnique({
      where: {
        id: this.id,
      },
      include: {
        groupDate: {
          include: {
            groupProgress: {
              include: {
                proofMethod: true,
                join: true,
              },
            },
          },
        },
      },
    });

    if (!group) return;

    // 각 groupProgress에 대해 proof 생성
    const proofPromises = group.groupDate.flatMap((date) =>
      date.groupProgress.map(async (progress) => {
        switch (progress.proofMethod.type) {
          case ProofType.UPLOAD_PHOTO:
            return this.prisma.groupProgress.update({
              where: { id: progress.id },
              data: {
                status: GroupProgressStatus.COMPLETED,
                proof: {
                  upsert: {
                    create: {
                      photoProof: {
                        create: {
                          url: `https://media-cldnry.s-nbcnews.com/image/upload/t_social_share_1024x768_scale,f_auto,q_auto:best/streams/2013/March/130326/1C6639340-google-logo.jpg`,
                        },
                      },
                    },
                    update: {},
                  },
                },
              },
            });

          case ProofType.CLICK_BUTTON:
            return this.prisma.groupProgress.update({
              where: { id: progress.id },
              data: {
                status: GroupProgressStatus.COMPLETED,
                proof: {
                  upsert: {
                    create: {
                      buttonClickProof: {
                        create: {},
                      },
                    },
                    update: {},
                  },
                },
              },
            });

          case 'CHECK_LOCATION':
            return this.prisma.groupProgress.update({
              where: { id: progress.id },
              data: {
                status: GroupProgressStatus.COMPLETED,
                proof: {
                  upsert: {
                    create: {
                      locationProof: {
                        create: {
                          latitude: 37.5665, // 서울시청 위도
                          longitude: 126.978, // 서울시청 경도
                        },
                      },
                    },
                    update: {},
                  },
                },
              },
            });

          default:
            return null;
        }
      }),
    );

    return await Promise.all(proofPromises);
  }
}
