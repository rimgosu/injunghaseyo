import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class BaseProofReq {
  @ApiProperty({
    description: '댓글 내용',
    example: '댓글 내용',
    type: String,
  })
  @IsString()
  contents: string;

  @ApiProperty({
    description: 'groupId',
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => +value)
  groupId?: number;
}
