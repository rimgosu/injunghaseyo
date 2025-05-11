import { IntersectionType, PickType } from '@nestjs/swagger';
import { BaseGroupRes } from './base-res.dto';
import { GroupWith } from '../utils/types';
import { JoinRole, User } from '@prisma/client';
import { JoinStatus, GroupStatus } from '../utils/enums';
import { GroupDateHelper } from '../utils/group-date.helper';
import { BaseResDto } from '@/common/base-res.dto';

export class GetGroupRes extends IntersectionType(
  PickType(BaseGroupRes, [
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
    'groupPhoto',
  ]),
  PickType(BaseResDto, ['canMutation']),
) {
  constructor(group: GroupWith, user: User | undefined) {
    super();
    this.participants = group.join.map((join) => ({
      id: join.user.id,
      profilePhoto:
        join.user.profilePhoto[join.user.profilePhoto.length - 1].url,
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
    this.proofMethods = group.proofMethod.map((method) => ({
      contents: method.contents,
      type: method.type,
      fromMin: method.fromMin,
      toMin: method.toMin,
    }));
    this.tags = group.groupTagMap.map((tagMap) => tagMap.tag.name);
    this.groupPhoto = group.photo;
    console.log('group.join:', group.join);

    this.canMutation =
      group.join.find((j) => j.joinRole === JoinRole.HOST).userId === user.id;
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
    const groupDateHelper = new GroupDateHelper(group.groupDate);
    return {
      startDate: new Date(groupDateHelper.startDate)
        .toISOString()
        .split('T')[0],
      endDate: new Date(groupDateHelper.endDate).toISOString().split('T')[0],
      joinStatus: groupDateHelper.getJoinStatus(user, group),
      status: groupDateHelper.getGroupStatus(),
    };
  }
}
