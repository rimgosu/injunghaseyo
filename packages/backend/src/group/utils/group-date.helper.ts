import { GroupDate, User } from '@prisma/client';
import { GroupWith, NINE_HOURS_IN_MS, ONE_DAY_IN_MS } from './types';
import { GroupStatus, JoinStatus } from './enums';

export class GroupDateHelper {
  groupDatesNumber: number[];
  groupDates: GroupDate[];
  startDate: number;
  endDate: number;
  endDayNight: number;
  now: number;
  constructor(groupDates: GroupDate[]) {
    this.groupDatesNumber = groupDates.map((date) =>
      new Date(date.date).getTime(),
    );
    this.groupDates = groupDates;
    this.startDate = Math.min(...this.groupDatesNumber);
    this.endDate = Math.max(...this.groupDatesNumber);
    this.endDayNight = this.endDate + ONE_DAY_IN_MS;
    this.now = new Date().getTime() + NINE_HOURS_IN_MS;
  }

  getJoinableDate(): GroupDate[] {
    const nextDay00Timestamp = new Date(
      new Date(new Date().getTime() + NINE_HOURS_IN_MS + 1000 * 60 * 60 * 24)
        .toISOString()
        .split('T')[0],
    ).getTime();

    return this.groupDates.filter(
      (date) => new Date(date.date).getTime() >= nextDay00Timestamp,
    );
  }

  getJoinStatus(user: User, group: GroupWith): JoinStatus {
    return !user || !group.join.some((j) => j.userId === user.id)
      ? this.getJoinableDate().length === 0
        ? JoinStatus.NOT_JOINABLE
        : JoinStatus.NOT_JOINED
      : this.now < this.startDate
        ? JoinStatus.RESERVED
        : this.now <= this.endDayNight
          ? JoinStatus.IN_PROGRESS
          : JoinStatus.COMPLETED;
  }

  getGroupStatus(): GroupStatus {
    return this.now < this.startDate
      ? GroupStatus.NOT_STARTED
      : this.now <= this.endDayNight
        ? GroupStatus.IN_PROGRESS
        : GroupStatus.COMPLETED;
  }
}
