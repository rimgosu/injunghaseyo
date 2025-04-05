import { ApiProperty, getSchemaPath, PickType } from '@nestjs/swagger';
import { BaseGroupRes } from './base-res.dto';
import { GroupWithToday, ProofMethodElem } from '../utils/types';
import {
  ButtonClickProof,
  GroupProgressStatus,
  LocationProof,
  PhotoProof,
} from '@prisma/client';

class PhotoProofElem implements Partial<PhotoProof> {
  @ApiProperty({
    description: '인증 사진 ID',
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: '인증 사진 URL',
    type: String,
  })
  url: string;

  constructor(photoProof: PhotoProof) {
    this.id = photoProof.id;
    this.url = photoProof.url;
  }
}

class ButtonClickProofElem implements Partial<ButtonClickProof> {
  @ApiProperty({
    description: '버튼 클릭 인증 ID',
    type: Number,
  })
  id: number;

  constructor(buttonClickProof: ButtonClickProof) {
    this.id = buttonClickProof.id;
  }
}

class LocationProofElem implements Partial<LocationProof> {
  @ApiProperty({
    description: '위치 인증 ID',
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: '위도',
    type: Number,
  })
  latitude: number;

  @ApiProperty({
    description: '경도',
    type: Number,
  })
  longitude: number;

  constructor(locationProof: LocationProof) {
    this.id = locationProof.id;
    this.latitude = locationProof.latitude;
    this.longitude = locationProof.longitude;
  }
}

class Proof extends PickType(BaseGroupRes, ['proofMethod', 'groupProgressId']) {
  @ApiProperty({
    description: '인증 정보',
    oneOf: [
      { $ref: getSchemaPath(PhotoProofElem) },
      { $ref: getSchemaPath(ButtonClickProofElem) },
      { $ref: getSchemaPath(LocationProofElem) },
    ],
    nullable: true,
  })
  proofElem: PhotoProofElem | ButtonClickProofElem | LocationProofElem | null;

  constructor(
    proofMethod: ProofMethodElem,
    proof: {
      photoProof: PhotoProof;
      buttonClickProof: ButtonClickProof;
      locationProof: LocationProof;
    } | null,
    groupProgressId: number,
  ) {
    super();
    this.proofMethod = proofMethod;
    this.groupProgressId = groupProgressId;

    this.proofElem = proof
      ? (proof.photoProof && new PhotoProofElem(proof.photoProof)) ||
        (proof.buttonClickProof &&
          new ButtonClickProofElem(proof.buttonClickProof)) ||
        (proof.locationProof && new LocationProofElem(proof.locationProof))
      : null;
  }
}

export class GetTodayRes extends PickType(BaseGroupRes, [
  'title',
  'description',
  'groupDate',
  'completedDate',
]) {
  @ApiProperty({
    description: '인증 정보',
    type: [Proof],
  })
  proofs: Proof[];

  constructor(group: GroupWithToday) {
    super();

    this.proofs = group.proofMethod.map((method) => {
      const proof = method.groupProgress[0]?.proof;
      return new Proof(
        {
          contents: method.contents,
          type: method.type,
          fromMin: method.fromMin,
          toMin: method.toMin,
        },
        proof,
        method.groupProgress[0]?.id,
      );
    });
    this.title = group.title;
    this.description = group.description;
    this.groupDate = group.groupDate.map((date) => date.date);

    this.completedDate = group.groupDate
      .filter((date) =>
        date.groupProgress.every(
          (progress) => progress.status === GroupProgressStatus.COMPLETED,
        ),
      )
      .map((date) => date.date);
  }
}
