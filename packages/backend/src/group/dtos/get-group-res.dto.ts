import { PickType } from '@nestjs/swagger';
import { BaseGroupRes } from './base-res.dto';
import { GroupWith, NINE_HOURS_IN_MS, ONE_DAY_IN_MS } from '../utils/types';
import { User } from '@prisma/client';
import { JoinStatus, GroupStatus } from '../utils/enums';

export class GetGroupRes extends PickType(BaseGroupRes, [
  'id',
  'title',
  'price',
  'description',
  'proofMethods',
  'status',
  'startDate',
  'endDate',
  'joinStatus',
  'tags',
  'participants',
]) {
  constructor(group: GroupWith, user: User | undefined) {
    super();
    this.participants = group.join.map((join) => ({
      id: join.user.id,
      profilePhoto: join.user.profilePhoto[0].url,
    }));
    const { startDate, endDate, joinStatus, status } = GetGroupRes.getDetails(
      group,
      user,
    );
    this.startDate = startDate;
    this.endDate = endDate;
    this.joinStatus = joinStatus;
    this.status = status;
    this.id = group.id;
    this.title = group.title;
    this.price = group.price;
    this.description = group.description;
    this.proofMethods = group.proofMethod.map((method) => method.method);
    this.tags = group.groupTagMap.map((tagMap) => tagMap.tag.name);
  }

  /**
   * @description 그룹 상세 정보 구하기
   *
   * - startDate, endDate, joinStatus
   */
  static getDetails(
    group: GroupWith,
    user: User | undefined,
  ): {
    startDate: string;
    endDate: string;
    joinStatus: JoinStatus;
    status: GroupStatus;
  } {
    const now = new Date().getTime() + NINE_HOURS_IN_MS;
    const groupDate: number[] = group.groupDate.map((date) =>
      new Date(date.date).getTime(),
    );
    const startDate = Math.min(...groupDate);
    const endDate = Math.max(...groupDate);
    const endDayNight = endDate + ONE_DAY_IN_MS;

    let joinStatus: JoinStatus;
    if (now < startDate) {
      joinStatus = JoinStatus.RESERVED;
    } else if (now <= endDayNight) {
      joinStatus = JoinStatus.IN_PROGRESS;
    } else {
      joinStatus = JoinStatus.COMPLETED;
    }

    joinStatus =
      user && group.join.some((j) => j.userId === user.id)
        ? joinStatus
        : JoinStatus.NOT_JOINED;

    const status =
      now < startDate
        ? GroupStatus.NOT_STARTED
        : now <= endDayNight
          ? GroupStatus.IN_PROGRESS
          : GroupStatus.COMPLETED;

    return {
      startDate: new Date(startDate).toISOString().split('T')[0],
      endDate: new Date(endDate).toISOString().split('T')[0],
      joinStatus,
      status,
    };
  }
}
