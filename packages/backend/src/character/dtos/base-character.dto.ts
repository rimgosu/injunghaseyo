import { ICheckLevelUpReturnType } from '@/character/utils/types';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class CheckLevelUpReturnType implements ICheckLevelUpReturnType {
  @ApiProperty({
    description: '레벨업 여부',
    type: Boolean,
  })
  levelUp: boolean;

  @ApiProperty({
    description: '이전 레벨',
    type: Number,
  })
  beforeLevel: number;

  @ApiProperty({
    description: '이후 레벨',
    type: Number,
  })
  afterLevel: number;
}

export class BaseCharacterDto {
  @ApiProperty({
    description: '유저가 고른 character id',
    type: Number,
    example: 1,
  })
  @Transform(({ value }) => +value)
  @IsNumber()
  characterId: number;

  @ApiProperty({
    description: '레벨업 시 노출 정보',
    type: CheckLevelUpReturnType,
    nullable: true,
  })
  checkLevelUpResult?: ICheckLevelUpReturnType | void;
}
