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
  GROUP_DATE_FOR_GALLERY,
  GROUP_FOR_LEAVE,
  GROUP_WITH_INCLUDE,
  GROUP_WITH_JOIN,
  GroupProgressWithMethod,
  GroupWith,
  GroupWithJoin,
  GroupWithProgress,
  GroupWithToday,
  JOIN_FOR_LEAVE,
} from './utils/types';
import { GetGroupsRes } from './dtos/get-groups-res.dto';
import {
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
import { GetGroupsQueryDto } from './dtos/get-groups-query.dto';
import { GroupDateHelper } from './utils/group-date.helper';
import { CharacterRewardService } from '@/character/character-reward.service';
import { UploadProofRes } from './dtos/upload-proof-res.dto';
import { GetGalleryParam } from './dtos/get-gallery-param.dto';
import { GetGalleryRes } from './dtos/get-gallery-res.dto';
import { UpdateGroupQuery } from './dtos/update-group-query.dto';
import { LeaveGroupHelper } from './utils/leave-group.helper';

@Injectable()
export class GroupService {
  private readonly logger = new Logger(GroupService.name, {
    timestamp: true,
  });

  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
    private readonly characterService: CharacterRewardService,
  ) {}

  /**
   * 그룹 mutation 권한 체크
   *
   * @description 그룹을 mutation할 수 있는 권한이 있는 지 확인합니다.
   */
  private async checkGroupHost(
    groupId: number,
    user: User,
  ): Promise<GroupWithJoin> {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId, deletedAt: null },
      ...GROUP_WITH_JOIN,
    });

    if (!group) throw new NotFoundException('그룹이 존재하지 않습니다.');
    if (group.join.length === 0)
      throw new NotFoundException('누구도 참여하지 않았습니다.');
    if (!group.join.find((j) => j.joinRole === JoinRole.HOST)) {
      this.logger.warn('그룹에 호스트가 한 명도 존재하지 않습니다.');
      throw new ForbiddenException('그룹 호스트가 존재하지 않습니다.');
    }
    if (
      group.join.find((j) => j.userId === user.id).joinRole !== JoinRole.HOST
    ) {
      this.logger.warn('호스트가 아닌 사람이 그룹 수정을 시도하였습니다.');
      throw new ForbiddenException('그룹 호스트가 아닙니다.');
    }

    return group;
  }

  /**
   * @description 그룹 수정
   *
   * title, description, photo, tags
   */
  async updateGroup(
    user: User,
    query: UpdateGroupQuery,
    groupId: number,
    groupPhoto?: Express.Multer.File,
  ) {
    const { title, description, tags } = query;

    const checkedGroup = await this.checkGroupHost(groupId, user);

    // 사진이 있다면 s3 업데이트
    let photo: string | undefined;
    if (groupPhoto) {
      photo = await this.s3.uploadFile(
        groupPhoto,
        `${this.s3.groupPhotoDir}/${checkedGroup.title}:${new Date().toISOString()}`,
      );
    }

    const allTags = await this.createTags(tags);

    return await this.prisma.$transaction(async (tx) => {
      const updatedGroup = await tx.group.update({
        where: { id: groupId, deletedAt: null },
        data: {
          ...(title && { title }),
          ...(description && { description }),
          ...(groupPhoto && photo && { photo }),
        },
      });

      await tx.groupTagMap.deleteMany({
        where: { groupId },
      });

      const updatedGroupTagMap = await tx.groupTagMap.createMany({
        data: allTags.map((tag) => ({
          groupId,
          tagId: tag.id,
        })),
      });

      return { updatedGroup, updatedGroupTagMap };
    });
  }

  /**
   * @description 갤러리 조회
   */
  async getGallery(param: GetGalleryParam): Promise<GetGalleryRes[]> {
    const { groupId } = param;

    const groupDates = await this.prisma.groupDate.findMany({
      where: { groupId, deletedAt: null },
      ...GROUP_DATE_FOR_GALLERY,
    });

    if (groupDates.length === 0) {
      throw new NotFoundException('갤러리에 표시할 인증이 없습니다.');
    }

    return GetGalleryRes.fromGroupDate(groupDates);
  }

  /**
   * @description 현재 위치 확인
   */
  async uploadProofLocation(
    param: UploadProofParam,
    query: UploadProofLocationQuery,
    user: User,
  ): Promise<UploadProofRes> {
    const { groupId } = param;
    const { progressId, today, latitude, longitude } = query;

    const { groupProgress, group } = await this.getProofGroupAndProgress(
      groupId,
      progressId,
      today,
      user,
    );

    await this.validateProof(group, groupProgress, ProofType.CHECK_LOCATION);

    await this.prisma.groupProgress.update({
      where: { id: progressId, deletedAt: null },
      data: {
        status: GroupProgressStatus.COMPLETED,
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

    return new UploadProofRes(
      await this.characterService.rewardProof({
        joinId: groupProgress.joinId,
        groupDateId: groupProgress.groupDateId,
        userId: user.id,
      }),
    );
  }

  /**
   * @description 인증 버튼 클릭
   */
  async uploadProofButton(
    param: UploadProofParam,
    query: UploadProofQuery,
    user: User,
  ): Promise<UploadProofRes> {
    const { groupId } = param;
    const { progressId, today } = query;

    const { groupProgress, group } = await this.getProofGroupAndProgress(
      groupId,
      progressId,
      today,
      user,
    );

    await this.validateProof(group, groupProgress, ProofType.CLICK_BUTTON);

    await this.prisma.groupProgress.update({
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

    return new UploadProofRes(
      await this.characterService.rewardProof({
        joinId: groupProgress.joinId,
        groupDateId: groupProgress.groupDateId,
        userId: user.id,
      }),
    );
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
  ): Promise<UploadProofRes> {
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
    await this.prisma.groupProgress.update({
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

    return new UploadProofRes(
      await this.characterService.rewardProof({
        joinId: groupProgress.joinId,
        groupDateId: groupProgress.groupDateId,
        userId: user.id,
      }),
    );
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
          join: true,
          groupDate: true,
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
            groupProgress: {
              where: {
                join: {
                  userId: user.id,
                  deletedAt: null,
                },
              },
            },
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
        ...GROUP_FOR_LEAVE,
      }),
      this.prisma.join.findFirst({
        where: { userId: user.id, groupId, deletedAt: null },
        ...JOIN_FOR_LEAVE,
      }),
      this.prisma.wallet.findUnique({
        where: { userId: user.id, deletedAt: null },
      }),
    ]);

    if (!group) throw new NotFoundException('모임이 존재하지 않습니다.');
    if (!join) throw new NotFoundException('참여자가 존재하지 않습니다.');
    if (!wallet) throw new NotFoundException('지갑이 존재하지 않습니다.');

    const leaveGroupHelper = new LeaveGroupHelper(join, group);

    if (!leaveGroupHelper.canRefund())
      throw new BadRequestException('환불할 수 없는 모임입니다.');

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
  async getGroups(
    user: User | undefined,
    query: GetGroupsQueryDto,
  ): Promise<GetGroupsRes> {
    const { take, cursor } = query;

    const groups: GroupWith[] = await this.prisma.group.findMany({
      where: query.groupWhereInput,
      take: take ? take + 1 : undefined,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { id: 'desc' },
      ...GROUP_WITH_INCLUDE,
    });

    const hasNextPage = groups.length > take;
    const items = hasNextPage ? groups.slice(0, -1) : groups;
    const nextCursor = hasNextPage ? groups[groups.length - 1].id : undefined;

    const validGroups = items.filter((gr) => {
      const lastDayNight = getLastDayNight(gr.groupDate);
      return isValidGroup(lastDayNight);
    });

    return new GetGroupsRes(validGroups, user, hasNextPage, nextCursor);
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

    const groupDateHelper = new GroupDateHelper(group?.groupDate || []);
    const joinableDates = groupDateHelper.getJoinableDate();

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

  private async createTags(tags?: string[]): Promise<Tag[]> {
    if (!tags) return [];
    if (tags.length === 0) return [];
    if (tags.length > 10)
      throw new BadRequestException('태그는 최대 10개까지 설정할 수 있습니다.');

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
