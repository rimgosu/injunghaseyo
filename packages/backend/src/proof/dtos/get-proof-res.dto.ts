import { ApiProperty } from '@nestjs/swagger';
import { ProofForGetProof } from '../utils/types';

class UserForGetProof {
  @ApiProperty({
    description: '유저 아이디',
    example: 1,
    type: Number,
  })
  userId: number;

  @ApiProperty({
    description: '유저 닉네임',
    example: '홍길동',
    type: String,
  })
  nickname: string;

  @ApiProperty({
    description: '유저 프로필 사진 주소',
    example: 'https://example.com/profile.jpg',
    type: String,
  })
  profilePhotoUrl: string;

  constructor(userId: number, nickname: string, profilePhotoUrl: string) {
    this.userId = userId;
    this.nickname = nickname;
    this.profilePhotoUrl = profilePhotoUrl;
  }
}

class GroupForGetProof {
  @ApiProperty({
    description: '그룹 아이디',
    example: 1,
    type: Number,
  })
  groupId: number;

  @ApiProperty({
    description: '그룹 제목',
    example: '홍길동',
    type: String,
  })
  title: string;

  constructor(groupId: number, title: string) {
    this.groupId = groupId;
    this.title = title;
  }
}

export class GetProofRes {
  @ApiProperty({
    description: '인증 id',
    example: 1,
    type: Number,
  })
  proofId: number;

  @ApiProperty({
    description: '다음 인증 id',
    example: 2,
    type: Number,
  })
  nextProofId: number;

  @ApiProperty({
    description: '인증 사진 주소',
    example: 'https://example.com/proof.jpg',
    type: String,
  })
  url: string;

  @ApiProperty({
    description: '좋아요 수',
    example: 1,
    type: Number,
  })
  like: number;

  @ApiProperty({
    description: '조회 수',
    example: 1,
    type: Number,
  })
  view: number;

  @ApiProperty({
    description: '댓글 수',
    example: 1,
    type: Number,
  })
  commentCount: number;

  @ApiProperty({
    description: '생성 일자',
    example: '2021-01-01',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: '유저 정보',
    type: UserForGetProof,
  })
  user: UserForGetProof;

  @ApiProperty({
    description: '그룹 정보',
    type: GroupForGetProof,
  })
  group: GroupForGetProof;

  constructor(proof: ProofForGetProof) {
    this.proofId = proof.id;
    this.url = proof.photoProof.url;
    this.like = proof._count.proofInteraction;
    this.view = proof.view;
    this.commentCount = proof._count.photoComment;
    this.createdAt = proof.createdAt;
    this.user = new UserForGetProof(
      proof.groupProgress.join.user.id,
      proof.groupProgress.join.user.nickname,
      proof.groupProgress.join.user.profilePhoto.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      )[0].url,
    );
    this.group = new GroupForGetProof(
      proof.groupProgress.join.group.id,
      proof.groupProgress.join.group.title,
    );
  }
}
