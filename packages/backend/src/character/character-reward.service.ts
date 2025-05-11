import { getToday } from '@/group/utils/utils';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { ExpHistoryType, GroupProgressStatus } from '@prisma/client';
import { CharacterInfoSelect, ICheckLevelUpReturnType } from './utils/types';

/**
 * @description 캐릭터 관련 서비스
 *
 * 3만원 짜리 모임 기준으로, 꾸준히 한 사람이면 레벨3 직전까지 가면 좋겠음.
 *
 * * 필요 경험치 양
 * 레벨1: 0
 * 레벨2: 100
 * 레벨3: 225
 * 레벨4: 375
 * 레벨5: 575
 *
 * * 레벨을 올릴 수 있는 방법
 * - 출석 체크 보상: +1exp
 * - 인증 보상: 3만원 기준, 총 +136exp (+46/1만원)
 * - 모임 종료 보상: 3만원 기준, 총 +34exp (+12/1만원)
 */
@Injectable()
export class CharacterRewardService {
  private readonly ATTENDANCE_CHECK_REWARD_EXP = 1;
  private readonly PROOF_REWARD_EXP_PER_10000WON = 46;
  private readonly END_REWARD_EXP_PER_10000WON = 12;

  private readonly logger = new Logger(CharacterRewardService.name, {
    timestamp: true,
  });

  constructor(private readonly prisma: PrismaService) {}

  /**
   * @description 오늘의 인증 시, 경험치 보상 지급
   */
  async rewardProof({
    joinId,
    groupDateId,
    userId,
  }: {
    joinId: number;
    groupDateId: number;
    userId: number;
  }): Promise<ICheckLevelUpReturnType | void> {
    const [groupProgress, group, expHistory] = await Promise.all([
      this.prisma.groupProgress.findMany({
        where: {
          deletedAt: null,
          joinId,
          groupDateId,
        },
      }),
      this.prisma.group.findFirst({
        where: {
          deletedAt: null,
          join: {
            some: {
              id: joinId,
              deletedAt: null,
            },
          },
        },
        select: {
          price: true,
          _count: {
            select: {
              groupDate: true,
            },
          },
        },
      }),
      this.prisma.expHistory.findUnique({
        where: {
          groupDateId_joinId: {
            groupDateId,
            joinId,
          },
        },
      }),
    ]);

    // validation
    // - 해당 일자의 모든 proofMethod가 완료 상태인지 확인
    // - 이미 경험치 지급 내역이 있는지 확인
    const isAllProofMethodCompleted = groupProgress.every(
      (progress) => progress.status === GroupProgressStatus.COMPLETED,
    );

    if (!isAllProofMethodCompleted || expHistory) {
      return;
    }

    // 줄 경험치 양 계산
    const increaseExp = Math.ceil(
      (this.PROOF_REWARD_EXP_PER_10000WON * group.price) /
        10000 /
        group._count.groupDate,
    );

    // 경험치 지급
    const updatedMyCharacter = await this.prisma.myCharacter.update({
      where: {
        userId,
        deletedAt: null,
      },
      data: {
        totalExp: {
          increment: increaseExp,
        },
        ExpHistory: {
          create: {
            type: ExpHistoryType.PROOF_REWARD,
            increasedExp: increaseExp,
            groupDateId,
            joinId,
          },
        },
      },
      include: {
        character: {
          select: {
            characterInfo: true,
          },
        },
      },
    });

    // 레벨업 했는지 확인
    const checkLevelUpResult = this.checkLevelUp({
      beforeTotalExp: updatedMyCharacter.totalExp - increaseExp,
      afterTotalExp: updatedMyCharacter.totalExp,
      characterInfo: updatedMyCharacter.character.characterInfo,
    });

    if (!checkLevelUpResult.levelUp) return;

    return checkLevelUpResult;
  }

  /**
   * @description 출석체크 경험치 보상 지급
   *
   * - 레벨업과 같은 특수한 이벤트 시에만 레벨업 결과를 반환한다.
   */
  async rewardSignIn(userId: number): Promise<ICheckLevelUpReturnType | void> {
    const todayTs = new Date(getToday('kst')).getTime();
    const todayNightTs = todayTs + 24 * 60 * 60 * 1000;

    const myCharacter = await this.prisma.myCharacter.findUnique({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        ExpHistory: {
          where: {
            type: ExpHistoryType.ATTENDANCE_CHECK_REWARD,
            createdAt: {
              gte: new Date(todayTs),
              lt: new Date(todayNightTs),
            },
          },
        },
      },
    });

    if (!myCharacter) {
      this.logger.debug('캐릭터가 없는 유저');
      return;
    }

    // 이미 출석체크 했으면 return
    if (myCharacter.ExpHistory.length > 0) {
      return;
    }

    // 출석체크 보상 지급
    const updatedMyCharacter = await this.prisma.myCharacter.update({
      where: {
        userId,
        deletedAt: null,
      },
      data: {
        totalExp: {
          increment: this.ATTENDANCE_CHECK_REWARD_EXP,
        },
        ExpHistory: {
          create: {
            type: ExpHistoryType.ATTENDANCE_CHECK_REWARD,
            increasedExp: this.ATTENDANCE_CHECK_REWARD_EXP,
          },
        },
      },
      select: {
        totalExp: true,
        character: {
          select: {
            characterInfo: {
              select: {
                expNeed: true,
                level: true,
              },
            },
          },
        },
      },
    });

    // 레벨업 했는지 확인
    const checkLevelUpResult = this.checkLevelUp({
      beforeTotalExp: myCharacter.totalExp,
      afterTotalExp: updatedMyCharacter.totalExp,
      characterInfo: updatedMyCharacter.character.characterInfo,
    });

    if (!checkLevelUpResult.levelUp) return;

    return checkLevelUpResult;
  }

  /**
   * @description 보상 지급으로 레벨업 했는지 확인
   */
  protected checkLevelUp({
    beforeTotalExp,
    afterTotalExp,
    characterInfo,
  }: {
    beforeTotalExp: number;
    afterTotalExp: number;
    characterInfo: CharacterInfoSelect[];
  }): ICheckLevelUpReturnType {
    const sortedInfo = characterInfo.sort((a, b) => a.expNeed - b.expNeed);

    const findLevel = (exp: number) => {
      const nextLevel = sortedInfo.find((info) => info.expNeed > exp);
      if (!nextLevel) {
        return sortedInfo[sortedInfo.length - 1].level;
      }
      const currentLevelInfo =
        sortedInfo[sortedInfo.findIndex((info) => info.expNeed > exp) - 1];
      return currentLevelInfo ? currentLevelInfo.level : sortedInfo[0].level;
    };

    const beforeLevel = findLevel(beforeTotalExp);
    const afterLevel = findLevel(afterTotalExp);

    return {
      levelUp: beforeLevel !== afterLevel,
      beforeLevel,
      afterLevel,
    };
  }
}
