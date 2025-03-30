import { ApiProperty } from '@nestjs/swagger';
import { GroupWithProgress, UserWithJoin } from '../utils/types';
import { GroupProgressStatus, ProfilePhoto } from '@prisma/client';
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

class ProfilePhotoElem {
  @ApiProperty({
    description: '프로필 사진 id',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: '프로필 사진 url',
    example: 'https://example.com/photo1.jpg',
    type: String,
  })
  url: string;

  constructor(profilePhoto: ProfilePhoto) {
    this.id = profilePhoto.id;
    this.url = profilePhoto.url;
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
    description: '자기소개',
    example: '등록된 소개말이 없습니다.',
    type: String,
  })
  introduction: string;

  @ApiProperty({
    description: '닉네임',
    example: '홍길동',
    type: String,
  })
  nickname: string;

  @ApiProperty({
    description: '총 인증한 일 수',
    example: 10,
    type: Number,
  })
  totalProofDays: number;

  @ApiProperty({
    description: '프로필 사진, 최신일 기준으로 내림차순 정렬',
    type: [ProfilePhotoElem],
    example: [
      {
        id: 1,
        url: 'https://example.com/photo1.jpg',
      },
      {
        id: 2,
        url: 'https://example.com/photo2.jpg',
      },
    ],
  })
  profilePhotos: ProfilePhotoElem[];

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
    this.introduction = userData.introduction;
    this.nickname = userData.nickname;
    this.profilePhotos = userData.profilePhoto
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((photo) => new ProfilePhotoElem(photo));

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
