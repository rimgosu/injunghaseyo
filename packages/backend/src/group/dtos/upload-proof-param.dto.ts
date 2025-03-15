import { ApiProperty, PickType } from '@nestjs/swagger';
import { BaseGroup } from './base.dto';
import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class UploadProofParam extends PickType(BaseGroup, ['groupId']) {}

export class UploadProofQuery extends PickType(BaseGroup, [
  'progressId',
  'today',
]) {}

export class UploadProofLocationQuery extends UploadProofQuery {
  @ApiProperty({
    description: '위도',
    example: 37.4943,
    required: true,
  })
  @IsNumber()
  @Transform(({ value }) => +value)
  latitude: number;

  @ApiProperty({
    description: '경도',
    example: 126.8611,
    required: true,
  })
  @IsNumber()
  @Transform(({ value }) => +value)
  longitude: number;
}
