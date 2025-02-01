import { PickType } from '@nestjs/swagger';
import { BaseGroup } from './base.dto';
import { GroupWithJoin } from '../utils/types';
import { GroupProgressStatus } from '@prisma/client';

export class GetTodayRewardRes extends PickType(BaseGroup, ['todayReward']) {
  /**
   * @description 총 받을 금액 조회
   *
   * 일일 단위로 정산하는 방식
   *   - DAILY_PRICE: 모임 가격 / 총 진행일 수 (예: 30,000원/30일 = 1,000원/일)
   *   - DAILY_POOL: 해당 일자의 전체 참여자들이 낸 금액 * NET(0.8)
   *   - MY_DAILY_REWARD: 특정 날짜에 인증 성공한 사람들끼리 DAILY_POOL 균등 분배
   *   - MY_TOTAL_REWARD: ∑(MY_DAILY_REWARD)
   */
  constructor(groupWithJoin: GroupWithJoin) {
    super();
    const NET = 0.8;
    const myJoinId = groupWithJoin.join[0].id;

    const dailyPrice = Math.floor(
      groupWithJoin.price / groupWithJoin.groupDate.length,
    );

    const myTotalReward = groupWithJoin.groupDate.reduce((acc, cur) => {
      const dailyPool = Math.floor(
        (NET * dailyPrice * cur.groupProgress.length) /
          groupWithJoin.proofMethod.length,
      );

      // 각 참여자별로 한 번만 성공 여부를 계산
      const successByJoinId: Map<number, boolean> = new Map();
      cur.groupProgress.forEach((prg) => {
        if (!successByJoinId.has(prg.joinId)) {
          const isSuccess = cur.groupProgress
            .filter((p) => p.joinId === prg.joinId)
            .every((p) => p.status === GroupProgressStatus.COMPLETED);
          successByJoinId.set(prg.joinId, isSuccess);
        }
      });

      const dailyTotalSuccessCount = Array.from(
        successByJoinId.values(),
      ).filter(Boolean).length;
      const dailyMySuccess = successByJoinId.get(myJoinId) || false;

      const myDailyReward =
        dailyMySuccess && dailyTotalSuccessCount > 0
          ? Math.floor(dailyPool / dailyTotalSuccessCount)
          : 0;

      return acc + myDailyReward;
    }, 0);

    this.todayReward = myTotalReward;
  }
}
