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
          return await tx.groupDate.update({
            where: {
              id: d.id,
            },
            data: {
              date: this.dates[index],
            },
          });
        }),
      ).catch((error) => {
        // 최초 실행 시 group 정보가 없어서 에러 발생
        console.error(error);
        return [];
      });

      // groupProgress bulk create
      const [joins, proofMethods] = await Promise.all([
        tx.join.findMany({
          where: {
            groupId: group.id,
          },
        }),
        tx.proofMethod.findMany({
          where: {
            groupId: group.id,
          },
        }),
      ]);

      const createdGroupProgresses = await Promise.all(
        joins.flatMap((join) =>
          groupDate.flatMap((date) =>
            proofMethods.map(async (method) => {
              const isToday =
                new Date(date.date)
                  .toLocaleString('en-US', { timeZone: 'Asia/Seoul' })
                  .split(',')[0] ===
                new Date()
                  .toLocaleString('en-US', { timeZone: 'Asia/Seoul' })
                  .split(',')[0];

              if (isToday) {
                const todayProgress = await tx.groupProgress.findUnique({
                  where: {
                    groupDateId_joinId_proofMethodId: {
                      groupDateId: date.id,
                      joinId: join.id,
                      proofMethodId: method.id,
                    },
                  },
                });
                if (todayProgress) {
                  await tx.proof
                    .findFirst({
                      where: {
                        groupProgressId: todayProgress.id,
                      },
                    })
                    .then(async (proof) => {
                      if (proof) {
                        // 댓글 관련 삭제
                        await tx.commentInteraction.deleteMany({
                          where: {
                            proofComment: {
                              proofId: proof.id,
                            },
                          },
                        });
                        await tx.proofComment.deleteMany({
                          where: { proofId: proof.id },
                        });

                        // 인증 관련 삭제
                        await tx.proofReport.deleteMany({
                          where: { proofId: proof.id },
                        });
                        await tx.proofInteraction.deleteMany({
                          where: { proofId: proof.id },
                        });

                        // 기존 인증 타입별 데이터 삭제
                        await tx.photoProof.deleteMany({
                          where: { proofId: proof.id },
                        });
                        await tx.buttonClickProof.deleteMany({
                          where: { proofId: proof.id },
                        });
                        await tx.locationProof.deleteMany({
                          where: { proofId: proof.id },
                        });

                        // 최종 proof 삭제
                        await tx.proof.delete({
                          where: { id: proof.id },
                        });
                      }
                    });
                }
              }

              return tx.groupProgress.upsert({
                where: {
                  groupDateId_joinId_proofMethodId: {
                    groupDateId: date.id,
                    joinId: join.id,
                    proofMethodId: method.id,
                  },
                },
                create: {
                  joinId: join.id,
                  groupDateId: date.id,
                  proofMethodId: method.id,
                  status: GroupProgressStatus.PENDING,
                },
                update: isToday
                  ? {
                      status: GroupProgressStatus.PENDING,
                    }
                  : {},
              });
            }),
          ),
        ),
      );

      return {
        group,
        groupDate,
        createdGroupProgresses,
      };
    });
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

          case ProofType.CHECK_LOCATION:
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
