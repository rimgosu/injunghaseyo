import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserQuery {
  @ApiProperty({
    description: '수정할 소개말',
    required: false,
    type: String,
    example: '수정된 소개말입니다.',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  introduction?: string;
}
