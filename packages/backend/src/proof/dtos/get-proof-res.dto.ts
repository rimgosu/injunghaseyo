import { ApiProperty } from '@nestjs/swagger';
import { PhotoWithProof } from '../utils/types';

export class GetProofRes {
  @ApiProperty({
    description: '인증 id',
    example: 1,
    type: Number,
  })
  proofId: number;

  @ApiProperty({
    description: '인증 이미지 url',
    example: 'https://example.com/image.jpg',
    type: String,
  })
  url: string;

  @ApiProperty({
    description: '인증 생성일',
    example: '2025-01-01T00:00:00Z',
    type: Date,
  })
  createdAt: Date;

  constructor(photoProof: PhotoWithProof) {
    this.proofId = photoProof.proofId;
    this.url = photoProof.url;
    this.createdAt = photoProof.createdAt;
  }
}
