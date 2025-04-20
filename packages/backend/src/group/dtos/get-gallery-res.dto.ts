import { ApiProperty, PickType } from '@nestjs/swagger';
import { BaseGroupRes } from './base-res.dto';
import { ProofType } from '@prisma/client';
import {
  TGroupDateForGallery,
  TGroupProgressWithUser,
  UserWithPhoto,
} from '../utils/types';

class ParticipantForGallery {
  @ApiProperty({
    description: '침여자 id',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: '침여자 닉네임',
    example: '홍길동',
    type: String,
  })
  nickname: string;

  @ApiProperty({
    description: '침여자 사진',
    example: 'https://example.com/photo.jpg',
    type: String,
  })
  profilePhoto: string;

  constructor(user: UserWithPhoto) {
    this.id = user.id;
    this.nickname = user.nickname;
    this.profilePhoto = user.profilePhoto.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )[0].url;
  }
}

class ProofForGallery extends PickType(BaseGroupRes, ['proofPhoto']) {
  @ApiProperty({
    description: '인증 타입',
    example: ProofType.CHECK_LOCATION,
    enum: ProofType,
  })
  proofType: ProofType;

  @ApiProperty({
    description: '참여자 목록',
    type: ParticipantForGallery,
  })
  participant: ParticipantForGallery;

  constructor(groupProgressWithUser: TGroupProgressWithUser) {
    super();

    const proof = groupProgressWithUser.proof;

    if (proof.photoProof) {
      this.proofType = ProofType.UPLOAD_PHOTO;
      this.proofPhoto = proof.photoProof.url;
    } else if (proof.locationProof) {
      this.proofType = ProofType.CHECK_LOCATION;
    } else if (proof.buttonClickProof) {
      this.proofType = ProofType.CLICK_BUTTON;
    }

    this.participant = new ParticipantForGallery(
      groupProgressWithUser.join.user,
    );
  }
}

export class GetGalleryRes {
  @ApiProperty({
    description: '일자',
    example: '2025-01-01',
    type: String,
  })
  date: string;

  @ApiProperty({
    description: '인증 사진',
    type: [ProofForGallery],
  })
  proofsForGallery: ProofForGallery[];

  constructor(date: string, groupProgressesWithUser: TGroupProgressWithUser[]) {
    this.date = date;
    this.proofsForGallery = groupProgressesWithUser.map(
      (gp) => new ProofForGallery(gp),
    );
  }

  static fromGroupDate(groupDates: TGroupDateForGallery[]): GetGalleryRes[] {
    const res = groupDates.map((gd) => {
      return new GetGalleryRes(gd.date, gd.groupProgress);
    });

    return res.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }
}
