import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateGroupQuery {
  @ApiProperty({
    description: '그룹 제목',
    example: '수정된 그룹 제목입니다',
    type: String,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: '그룹 설명',
    example: '수정된 그룹 설명입니다',
    type: String,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '그룹 태그',
    example: ['태그1', '태그2'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  tags?: string[];
}
