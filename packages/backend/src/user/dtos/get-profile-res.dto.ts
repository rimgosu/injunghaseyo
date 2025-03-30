import { ApiProperty } from '@nestjs/swagger';
import { GroupWithProgress, UserWithJoin } from '../utils/types';
import { GroupProgressStatus } from '@prisma/client';
import { GroupDateHelper } from '@/group/utils/group-date.helper';
import { GroupStatus } from '@/group/utils/enums';

class ProfileGroupElem {
  @ApiProperty({
    description: '그룹 이름',
    example: '팔굽혀펴기 인증 모임',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: '그룹 진행 일 차',
    example: 10,
    type: Number,
  })
  proofDays: number;

  constructor(group: GroupWithProgress) {
    const proofDays = group.groupDate.reduce((acc, curr) => {
      const isCompleted = curr.groupProgress.every(
        (gp) => gp.status === GroupProgressStatus.COMPLETED,
      );
      return acc + (isCompleted ? 1 : 0);
    }, 0);

    this.name = group.title;
    this.proofDays = proofDays;
  }
}

export class GetProfileResDto {
  @ApiProperty({
    description: '인증머니',
    example: 100000,
    type: Number,
  })
  money: number;

  @ApiProperty({
    description: '총 인증한 일 수',
    example: 10,
    type: Number,
  })
  totalProofDays: number;

  @ApiProperty({
    description: '프로필 사진',
    type: [String],
    example: [
      'https://example.com/photo1.jpg',
      'https://example.com/photo2.jpg',
    ],
  })
  profilePhotos: string[];

  @ApiProperty({
    description: '진행중인 인증',
    type: [ProfileGroupElem],
  })
  currentGroup: ProfileGroupElem[];

  @ApiProperty({
    description: '예약한 인증',
    type: [ProfileGroupElem],
  })
  reservedGroup: ProfileGroupElem[];

  @ApiProperty({
    description: '완료한 인증',
    type: [ProfileGroupElem],
  })
  completedGroup: ProfileGroupElem[];

  private filterGroupsByStatus(
    userData: UserWithJoin,
    status: GroupStatus,
  ): ProfileGroupElem[] {
    return userData.join
      .filter((join) => {
        const groupDateHelper = new GroupDateHelper(join.group.groupDate);
        return groupDateHelper.getGroupStatus() === status;
      })
      .map((join) => new ProfileGroupElem(join.group));
  }

  constructor(userData: UserWithJoin) {
    this.money = userData.wallet.money;
    this.profilePhotos = userData.profilePhoto.map((photo) => photo.url);

    this.currentGroup = this.filterGroupsByStatus(
      userData,
      GroupStatus.IN_PROGRESS,
    );
    this.reservedGroup = this.filterGroupsByStatus(
      userData,
      GroupStatus.NOT_STARTED,
    );
    this.completedGroup = this.filterGroupsByStatus(
      userData,
      GroupStatus.COMPLETED,
    );

    this.totalProofDays = [
      ...this.currentGroup,
      ...this.reservedGroup,
      ...this.completedGroup,
    ].reduce((acc, curr) => acc + curr.proofDays, 0);
  }
}
