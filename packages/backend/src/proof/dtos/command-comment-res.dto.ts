import { ApiProperty } from '@nestjs/swagger';
import { ProofComment } from '@prisma/client';

export class CommandCommentRes implements ProofComment {
  @ApiProperty({
    description: '댓글 아이디',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: '댓글 내용',
    example: '댓글 내용',
    type: String,
  })
  contents: string;

  @ApiProperty({
    description: '댓글 작성자 아이디',
    example: 1,
    type: Number,
  })
  userId: number;

  @ApiProperty({
    description: '댓글 부모 아이디',
    example: 1,
    type: Number,
    nullable: true,
  })
  parentId: number | null;

  @ApiProperty({
    description: '댓글 proof 아이디',
    example: 1,
    type: Number,
  })
  proofId: number;

  @ApiProperty({
    description: '댓글 생성일',
    example: '2021-01-01',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: '댓글 삭제일',
    example: '2021-01-01',
    type: Date,
    nullable: true,
  })
  deletedAt: Date | null;

  @ApiProperty({
    description: '댓글 수정일',
    example: '2021-01-01',
    type: Date,
  })
  updatedAt: Date;

  constructor(proofComment: ProofComment) {
    this.id = proofComment.id;
    this.contents = proofComment.contents;
    this.userId = proofComment.userId;
    this.parentId = proofComment.parentId;
    this.proofId = proofComment.proofId;
    this.createdAt = proofComment.createdAt;
    this.updatedAt = proofComment.updatedAt;
    this.deletedAt = proofComment.deletedAt;
  }
}
