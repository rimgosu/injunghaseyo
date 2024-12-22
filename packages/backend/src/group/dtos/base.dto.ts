import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';

export class BaseGroupDto {
  @ApiProperty({
    description: '모임 제목',
    type: String,
    example: '헬스장 인증 모임',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '모임 가격 (원)',
    type: Number,
    example: 30000,
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  price: number;

  @ApiProperty({
    description: '모임 상세',
    type: String,
    example: '헬스장 가고 인증하는 모임입니다.',
    required: false,
  })
  @IsString()
  description?: string;

  @ApiProperty({
    description: '인증 방법',
    type: String,
    example: '헬스장 출입 전\n헬스장 출입 후\n인증사진 찍어서 인증',
  })
  @IsString()
  @IsNotEmpty()
  proofMethod: string;

  @ApiProperty({
    description:
      '시간 (일자), ?dates=2024-12-21&dates=2024-12-22 꼴로 날짜 배열로 받음',
    type: [String],
    example: ['2024-12-21', '2024-12-22'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    each: true,
    message: '날짜는 yyyy-mm-dd 형식이어야 합니다.',
  })
  dates: string[];

  @ApiProperty({
    description: '태그, ?tags=헬스&tags=건강 꼴로 날짜 배열로 받음',
    type: [String],
    example: ['헬스', '건강'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  tags: string[];
}
