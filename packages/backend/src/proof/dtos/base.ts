import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class BaseProofReq {
  @ApiProperty({
    description: '댓글 내용',
    example: '댓글 내용',
    type: String,
  })
  @IsString()
  contents: string;
}
