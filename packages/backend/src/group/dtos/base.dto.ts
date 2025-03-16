import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ProofType } from '@prisma/client';
import { ProofMethodElem } from '../utils/types';
import { CreateGroupElement } from '../utils/enums';

@ValidatorConstraint({ name: 'validateToday', async: false })
class ValidateTodayConstraint implements ValidatorConstraintInterface {
  validate() {
    if (process.env.NODE_ENV !== 'dev') {
      return false;
    }
    return true;
  }

  defaultMessage() {
    return '개발 환경에서만 today 값을 변경할 수 있습니다.';
  }
}
export class BaseGroup {
  @ApiProperty({
    description: '검증할 요소 값',
    oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'object' }],
  })
  @IsNotEmpty()
  validateValue: unknown;

  @ApiProperty({
    description: '검증할 요소 타입',
    enum: CreateGroupElement,
  })
  @IsEnum(CreateGroupElement)
  validateType: CreateGroupElement;

  @ApiProperty({
    description: '오늘까지의 받을 금액',
    type: Number,
    example: 1000,
  })
  @IsNumber()
  todayReward: number;

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
    type: [ProofMethodElem],
    example: [
      {
        contents: '헬스장 출입 전',
        type: ProofType.CHECK_LOCATION,
        fromMin: 0,
        toMin: 1440,
      },
      {
        contents: '헬스장 출입 후',
        type: ProofType.UPLOAD_PHOTO,
        fromMin: 0,
        toMin: 1440,
      },
      {
        contents: '기상 후 버튼 클릭',
        type: ProofType.CLICK_BUTTON,
        fromMin: 60 * 6,
        toMin: 60 * 7,
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  proofMethods: ProofMethodElem[];

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

  @ApiProperty({
    description: '태그 검색',
    type: String,
    example: '헰',
  })
  @IsString()
  @IsNotEmpty()
  tagSearch: string;

  @ApiProperty({
    description: '태그, ?tags=헬스&tags=건강 꼴로 날짜 배열로 받음',
    type: [String],
    example: ['건강'],
    required: false,
  })
  @IsOptional()
  @IsArray({})
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  selectedTags?: string[];

  @ApiProperty({
    description: '모임 ID',
    type: Number,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  groupId: number;

  @ApiProperty({
    description: '(개발 전용), 오늘 날짜를 원하는 날짜로 지정한다.',
    type: String,
    example: '2025-01-18',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: '날짜는 yyyy-mm-dd 형식이어야 합니다.',
  })
  @IsOptional()
  @Validate(ValidateTodayConstraint)
  today?: string;

  @ApiProperty({
    description: '진행 id',
    type: Number,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  progressId: number;
}
