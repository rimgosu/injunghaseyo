import { User } from '@prisma/client';
import { JoinStatus, GroupStatus } from '../utils/enums';
import { ApiProperty } from '@nestjs/swagger';
import { GroupWith } from '../utils/types';

class GroupElem {
  @ApiProperty({
    description: '그룹 ID',
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: '그룹 제목',
    type: String,
  })
  title: string;

  @ApiProperty({
    description: '그룹 가격',
    type: Number,
  })
  price: number;

  @ApiProperty({
    description: '그룹 설명',
    type: String,
  })
  description: string;

  @ApiProperty({
    description: '그룹 증명 방법',
    type: String,
  })
  proofMethod: string;

  @ApiProperty({
    description: '그룹 상태',
    enum: GroupStatus,
  })
  status: GroupStatus;

  @ApiProperty({
    description: '그룹 시작일',
    type: String,
  })
  startDate: string;

  @ApiProperty({
    description: '그룹 종료일',
    type: String,
  })
  endDate: string;

  @ApiProperty({
    description: '참여자 수',
    type: Number,
  })
  numberOfParticipants: number;

  @ApiProperty({
    description: '참여 상태',
    enum: JoinStatus,
  })
  joinStatus?: JoinStatus;

  @ApiProperty({
    description: '태그',
    type: [String],
  })
  tags: string[];
}

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
      const { startDate, endDate, joinStatus, status } = this.getDetails(
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

  /**
   * @description 그룹 상세 정보 구하기
   *
   * - startDate, endDate, joinStatus
   */
  private getDetails(
    group: GroupWith,
    user: User | undefined,
  ): {
    startDate: string;
    endDate: string;
    joinStatus: JoinStatus;
    status: GroupStatus;
  } {
    const now = new Date().getTime();
    const groupDate: number[] = group.groupDate.map((date) =>
      new Date(date.date).getTime(),
    );
    const startDate = Math.min(...groupDate);
    const endDate = Math.max(...groupDate);
    const endDayNight = endDate + 1000 * 60 * 60 * 24;

    let joinStatus: JoinStatus;
    if (now < startDate) {
      joinStatus = JoinStatus.RESERVED;
    } else if (startDate <= now && now <= endDayNight) {
      joinStatus = JoinStatus.IN_PROGRESS;
    } else if (endDayNight < now) {
      joinStatus = JoinStatus.COMPLETED;
    }

    joinStatus = user
      ? group.join.find((j) => j.userId === user.id)
        ? joinStatus
        : JoinStatus.NOT_JOINED
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
