import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  GroupProgressStatus,
  JoinRole,
  ProofType,
  Tag,
  User,
  WalletHistoryReason,
} from '@prisma/client';
import { CreateGroupParams } from './dtos/create-group-params.dto';
import { GetTagsParams } from './dtos/get-tags-param.dto';
import { GetTagsRes } from './dtos/get-tags-res.dto';
import { JoinGroupParam } from './dtos/join-group-param.dto';
import {
  GROUP_WITH_INCLUDE,
  GroupProgressWithMethod,
  GroupWith,
  GroupWithProgress,
  GroupWithToday,
} from './utils/types';
import { GetGroupsRes } from './dtos/get-groups-res.dto';
import {
  canRefund,
  getJoinableDate,
  getLastDayNight,
  getToday,
  isBetweenMinutes,
  isValidGroup,
  validateGroupDates,
} from './utils/utils';
import { GetGroupParam } from './dtos/get-group-param.dto';
import { GetGroupRes } from './dtos/get-group-res.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { LeaveGroupParam } from './dtos/leave-group-param.dto';
import { GetTodayParam } from './dtos/get-today-params.dto';
import { GetTodayRes } from './dtos/get-today-res.dto';
import { GetTodayQuery } from './dtos/get-today-query.dto';
import {
  UploadProofLocationQuery,
  UploadProofParam,
  UploadProofQuery,
} from './dtos/upload-proof-param.dto';
import { S3Service } from '@/s3/s3.service';
import { GetTodayRewardRes } from './dtos/get-today-reward-res.dto';
import { GetTodayRewardParam } from './dtos/get-today-reward-param.dto';
import { CreateGroupBody } from './dtos/create-group-body.dto';
import { ValidateCreateGroupElementBody } from './dtos/validate-create-group-elem-query.dto';
import { GroupElementValidationStrategyFactory } from './utils/group-create-validate.strategy';

@Injectable()
export class GroupService {
  private readonly logger = new Logger(GroupService.name, {
    timestamp: true,
  });

  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
  ) {}

  /**
   * @description 현재 위치 확인
   */
  async uploadProofLocation(
    param: UploadProofParam,
    query: UploadProofLocationQuery,
    user: User,
  ) {
    const { groupId } = param;
    const { progressId, today, latitude, longitude } = query;

    const { groupProgress, group } = await this.getProofGroupAndProgress(
      groupId,
      progressId,
      today,
      user,
    );

    await this.validateProof(group, groupProgress, ProofType.CHECK_LOCATION);

    return await this.prisma.groupProgress.update({
      where: { id: progressId, deletedAt: null },
      data: {
        proof: {
          upsert: {
            create: {
              locationProof: {
                create: { latitude, longitude },
              },
            },
            update: {
              locationProof: {
                upsert: {
                  create: { latitude, longitude },
                  update: { latitude, longitude },
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * @description 인증 버튼 클릭
   */
  async uploadProofButton(
    param: UploadProofParam,
    query: UploadProofQuery,
    user: User,
  ) {
    const { groupId } = param;
    const { progressId, today } = query;

    const { groupProgress, group } = await this.getProofGroupAndProgress(
      groupId,
      progressId,
      today,
      user,
    );

    await this.validateProof(group, groupProgress, ProofType.CLICK_BUTTON);

    return await this.prisma.groupProgress.update({
      where: { id: progressId, deletedAt: null },
      data: {
        status: GroupProgressStatus.COMPLETED,
        proof: {
          create: {
            buttonClickProof: {
              create: {},
            },
          },
        },
      },
    });
  }

  /**
   * @description 그룹 생성 요소 검증
   */
  async validateCreateGroupElement(
    body: ValidateCreateGroupElementBody,
    user: User,
  ) {
    const { validateType, validateValue } = body;
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        userId: user.id,
        deletedAt: null,
      },
    });
    await GroupElementValidationStrategyFactory.getInstance()
      .getStrategy(validateType)
      .validate(validateValue, wallet);

    return {
      message: '올바른 요소입니다.',
      validateType,
      validateValue,
    };
  }

  /**
   * @description 오늘까지 받을 금액 조회
   */
  async getTodayReward(
    param: GetTodayRewardParam,
    user: User,
  ): Promise<GetTodayRewardRes> {
    const { groupId } = param;

    const group = await this.prisma.group.findUnique({
      where: { id: groupId, deletedAt: null },
      include: {
        groupDate: {
          include: {
            groupProgress: true,
          },
        },
        proofMethod: true,
        join: {
          where: { userId: user.id, deletedAt: null },
        },
      },
    });

    if (group?.join?.length === 0)
      throw new NotFoundException('참여하지 않았습니다.');

    return new GetTodayRewardRes(group);
  }

  /**
   * @description 인증 사진 업로드
   */
  async uploadProofPhoto(
    param: UploadProofParam,
    query: UploadProofQuery,
    proofPhoto: Express.Multer.File,
    user: User,
  ) {
    const { groupId } = param;
    const { progressId } = query;

    const { groupProgress, group } = await this.getProofGroupAndProgress(
      groupId,
      progressId,
      query.today,
      user,
    );

    await this.validateProof(group, groupProgress, ProofType.UPLOAD_PHOTO);

    // s3에 사진 업로드
    const uploadUrl = await this.s3.uploadFile(
      proofPhoto,
      `${this.s3.proofPhotoDir}/${user.email}:${group.title}:${groupProgress.proofMethod.id}:${groupProgress.proofMethod.contents}:${new Date().toISOString()}`,
    );

    // 인증 사진 업데이트
    return await this.prisma.groupProgress.update({
      where: {
        id: progressId,
        deletedAt: null,
      },
      data: {
        proof: {
          upsert: {
            create: {
              photoProof: {
                create: {
                  url: uploadUrl,
                },
              },
            },
            update: {
              photoProof: {
                upsert: {
                  create: {
                    url: uploadUrl,
                  },
                  update: {
                    url: uploadUrl,
                  },
                },
              },
            },
          },
        },
        status: GroupProgressStatus.COMPLETED,
      },
      select: {
        proofMethod: {
          select: {
            contents: true,
            type: true,
            fromMin: true,
            toMin: true,
          },
        },
        proof: {
          select: {
            photoProof: {
              select: {
                url: true,
              },
            },
          },
        },
        status: true,
      },
    });
  }

  /**
   * @description group, groupProgress 조회
   */
  private async getProofGroupAndProgress(
    groupId: number,
    progressId: number,
    todayQuery: string | undefined,
    user: User,
  ): Promise<{
    groupProgress: GroupProgressWithMethod;
    group: GroupWithProgress;
  }> {
    // groupProgress 정상적으로 존재하는지 확인
    const today = todayQuery ? todayQuery : getToday();

    const [groupProgress, group] = await Promise.all([
      this.prisma.groupProgress.findUnique({
        where: {
          id: progressId,
          deletedAt: null,
          groupDate: {
            date: today,
            deletedAt: null,
            group: { id: groupId },
          },
          join: { userId: user.id, deletedAt: null, group: { id: groupId } },
        },
        include: {
          proofMethod: true,
        },
      }),
      this.prisma.group.findUnique({
        where: { id: groupId, deletedAt: null },
        include: {
          proofMethod: {
            where: {
              groupProgress: {
                some: {
                  id: progressId,
                },
              },
            },
          },
        },
      }),
    ]);

    return { groupProgress, group };
  }

  /**
   * @description 올바른 인증인지 조회
   */
  private async validateProof(
    group: GroupWithProgress,
    groupProgress: GroupProgressWithMethod,
    proofType: ProofType,
  ): Promise<void> {
    if (!groupProgress) throw new NotFoundException('오늘의 인증이 없습니다.');

    if (group.proofMethod[0].type !== proofType)
      throw new BadRequestException(
        `${proofType} 방법으로 인증하는 인증 방법이 아닙니다.`,
      );

    if (
      group.proofMethod[0].type === ProofType.CLICK_BUTTON &&
      groupProgress.status === GroupProgressStatus.COMPLETED
    )
      throw new BadRequestException('이미 인증을 완료하였습니다.');

    if (
      !isBetweenMinutes(
        groupProgress.proofMethod.fromMin,
        groupProgress.proofMethod.toMin,
        'kst',
      )
    )
      throw new ForbiddenException('인증 시간이 아닙니다.');
  }

  /**
   * @description 오늘의 인증 조회
   */
  async getToday(
    param: GetTodayParam,
    user: User,
    query: GetTodayQuery,
  ): Promise<GetTodayRes> {
    const { groupId } = param;

    // 오늘 날짜
    const today = query.today ? query.today : getToday();
    const group: GroupWithToday = await this.prisma.group.findUnique({
      where: { id: groupId, deletedAt: null },
      include: {
        groupDate: {
          include: {
            groupProgress: true,
          },
        },
        proofMethod: {
          include: {
            groupProgress: {
              where: {
                groupDate: {
                  date: today,
                },
                join: {
                  userId: user.id,
                },
              },
              include: {
                proof: {
                  include: {
                    photoProof: true,
                    buttonClickProof: true,
                    locationProof: true,
                  },
                },
              },
            },
          },
        },
        join: {
          where: { userId: user.id, deletedAt: null },
        },
      },
    });

    if (!group?.proofMethod[0]?.groupProgress?.length)
      throw new NotFoundException('오늘의 인증이 없습니다.');

    return new GetTodayRes(group);
  }

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
   *
   * - 중간에 참여할 수 있다. 중간에 참여할 경우 다음날부터 인증을 할 수 있다.
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

    const joinableDates = getJoinableDate(group?.groupDate || []);
    const joinMoney =
      joinableDates.length === (group?.groupDate?.length || 0)
        ? group?.price
        : Math.floor(
            (group?.price * joinableDates.length) /
              (group?.groupDate?.length || 0),
          ); // 중간에 참여할 경우 인증 머니 계산

    if (joinableDates.length === 0)
      throw new ForbiddenException('참여할 수 있는 날짜가 없습니다.');

    if (!group) throw new NotFoundException('모임이 존재하지 않습니다.');

    if (wallet?.money < joinMoney)
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

      await tx.groupProgress.createMany({
        data: joinableDates.flatMap((date) =>
          group.proofMethod.map((method) => ({
            groupDateId: date.id,
            joinId: join.id,
            proofMethodId: method.id,
            status: GroupProgressStatus.PENDING,
          })),
        ),
      });

      const updatedWallet = await tx.wallet.update({
        where: { userId: user.id, deletedAt: null },
        data: {
          money: { decrement: joinMoney },
          walletHistory: {
            create: {
              previousMoney: wallet.money,
              currentMoney: wallet.money - joinMoney,
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
  async createGroup(
    user: User,
    params: CreateGroupParams,
    body: CreateGroupBody,
  ) {
    const { dates, price, tags, title } = params;
    const { proofMethods } = body;

    if (!validateGroupDates(dates))
      throw new ForbiddenException('최소 3일 전에 모임을 생성해야 합니다.');

    const allTags = await this.createTags(tags);

    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: user.id, deletedAt: null },
    });

    if (!wallet) throw new NotFoundException('지갑이 존재하지 않습니다.');
    if (wallet?.money < price)
      throw new ForbiddenException('잔액이 부족합니다.');

    return await this.prisma.$transaction(async (tx) => {
      const group = await tx.group.create({
        data: {
          title,
          price,
          proofMethod: {
            createMany: {
              data: proofMethods.map((method) => {
                return method;
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
              contents: true,
              type: true,
              fromMin: true,
              toMin: true,
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
