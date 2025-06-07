import { JoinRole } from '@prisma/client';
import { GroupForLeave, JoinForLeave } from './types';
import { UnprocessableEntityException } from '@nestjs/common';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export class LeaveGroupHelper {
  private readonly groupDates: dayjs.Dayjs[];
  private readonly joinedAt: dayjs.Dayjs;
  private readonly now: dayjs.Dayjs;
  private readonly joinRole: JoinRole;
  private readonly existGroupProgress: boolean;

  constructor(join: JoinForLeave, group: GroupForLeave) {
    this.groupDates = group.groupDate
      .map((d) => dayjs(d.date).tz('Asia/Seoul'))
      .sort((a, b) => a.valueOf() - b.valueOf());
    this.joinedAt = dayjs(join.createdAt).tz('Asia/Seoul');
    this.joinRole = join.joinRole;
    this.existGroupProgress = join.groupProgress.length > 0;
    this.now = dayjs().tz('Asia/Seoul');
  }

  /**
   * 환불 가능한 경우
   *
   * 항상 적용
   * - groupProgress 진행 X여야만 환불 가능
   * - 모임 참여 후 1시간 내로 떠날 경우 환불 가능
   *
   * 모임 진행 전
   * - 무조건 환불 가능
   *
   * 모임 진행 후
   * - 모임 참여 후 다음날이 되기 전까지
   */
  canRefund(): boolean {
    if (this.existGroupProgress) return false;
    if (this.now.diff(this.joinedAt, 'hour') < 1) return true;

    const earliestGroupDate = this.groupDates[0];

    const isBeforeGroup = this.now.isBefore(earliestGroupDate.startOf('day'));
    if (isBeforeGroup) return true;

    const joinNextGroupDate = this.groupDates.find((date) =>
      date.isAfter(this.joinedAt),
    );
    if (!joinNextGroupDate) {
      throw new UnprocessableEntityException(
        '참여 이후 진행될 그룹 날짜가 없습니다. 데이터 무결성을 확인해주세요.',
      );
    }

    return this.now.isBefore(joinNextGroupDate.startOf('day'));
  }
}
