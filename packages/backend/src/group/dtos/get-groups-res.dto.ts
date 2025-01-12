import { User } from '@prisma/client';
import { JoinStatus, GroupStatus } from '../utils/enums';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { GroupWith } from '../utils/types';
import { BaseGroupRes } from './base-res.dto';
import { GetGroupRes } from './get-group-res.dto';

class GroupElem extends PickType(BaseGroupRes, [
  'id',
  'title',
  'price',
  'description',
  'proofMethod',
  'status',
  'startDate',
  'endDate',
  'joinStatus',
  'numberOfParticipants',
  'tags',
]) {}

export class GetGroupsRes {
  @ApiProperty({
    description: '그룹 목록',
    type: [GroupElem],
  })
  groups: GroupElem[];

  constructor(groups: GroupWith[], user: User | undefined) {
    this.groups = groups.map((group) => {
      const tags = group.groupTagMap.map((tagMap) => tagMap.tag.name);
      const numberOfParticipants = group.join.length;
      const { startDate, endDate, joinStatus, status } = GetGroupRes.getDetails(
        group,
        user,
      );

      return {
        id: group.id,
        title: group.title,
        price: group.price,
        description: group.description,
        proofMethod: group.proofMethod,
        status,
        startDate,
        endDate,
        joinStatus,
        numberOfParticipants,
        tags,
      };
    });
  }
}
