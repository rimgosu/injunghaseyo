import { ApiProperty } from '@nestjs/swagger';
import { BaseCursorPaginationResDto } from '@/common/base-cursor-pagination-res.dto';
import { ProofWithPhoto } from '../utils/types';

class Proof {
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

  constructor(proof: ProofWithPhoto) {
    this.proofId = proof.id;
    this.url = proof.photoProof.url;
    this.createdAt = proof.createdAt;
  }
}

export class GetProofRes extends BaseCursorPaginationResDto<Proof> {
  @ApiProperty({
    description: '인증 목록',
    type: [Proof],
  })
  items: Proof[];

  constructor(
    proofs: ProofWithPhoto[],
    hasNextPage: boolean,
    nextCursor?: number,
  ) {
    super(
      proofs.map((proof) => new Proof(proof)),
      hasNextPage,
      nextCursor,
    );
  }
}
