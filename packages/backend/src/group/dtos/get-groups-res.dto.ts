import { User } from '@prisma/client';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { GroupWith } from '../utils/types';
import { BaseGroupRes } from './base-res.dto';
import { GetGroupRes } from './get-group-res.dto';
import { BaseCursorPaginationResDto } from '@/common/base-cursor-pagination-res.dto';

class GroupElem extends PickType(BaseGroupRes, [
  'id',
  'title',
  'price',
  'description',
  'proofMethods',
  'status',
  'startDate',
  'endDate',
  'joinStatus',
  'numberOfParticipants',
  'tags',
  'groupPhoto',
]) {}

export class GetGroupsRes extends BaseCursorPaginationResDto<GroupElem> {
  @ApiProperty({
    description: '그룹 목록',
    type: [GroupElem],
  })
  items: GroupElem[];

  constructor(
    groups: GroupWith[],
    user: User | undefined,
    hasNextPage: boolean,
    nextCursor?: number,
  ) {
    const items = groups.map((group) => {
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
        proofMethods: group.proofMethod.map((method) => ({
          contents: method.contents,
          type: method.type,
          fromMin: method.fromMin,
          toMin: method.toMin,
        })),
        status,
        startDate,
        endDate,
        joinStatus,
        numberOfParticipants,
        tags,
        groupPhoto: group.photo,
      };
    });

    super(items, hasNextPage, nextCursor);
  }
}
