import { getToday } from '@/group/utils/utils';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ExpHistoryType } from '@prisma/client';
import { CharacterInfoSelect, CheckLevelUpReturnType } from './utils/types';

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
export class CharacterService {
  private readonly ATTENDANCE_CHECK_REWARD_EXP = 1;
  private readonly PROOF_REWARD_EXP_PER_10000WON = 46;
  private readonly END_REWARD_EXP_PER_10000WON = 12;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * @description 출석체크 보상 지급
   *
   * - 레벨업과 같은 특수한 이벤트 시에만 레벨업 결과를 반환한다.
   */
  async rewardSignIn(userId: number): Promise<CheckLevelUpReturnType | void> {
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
  }): CheckLevelUpReturnType {
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
