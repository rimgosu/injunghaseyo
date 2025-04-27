import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateCommentQuery {
  @ApiProperty({
    description: '부모 댓글 id',
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => +value)
  parentCommentId?: number;
}
