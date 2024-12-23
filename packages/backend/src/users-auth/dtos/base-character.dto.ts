import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class BaseCharacterDto {
  @ApiProperty({
    description: '유저가 고른 character id',
    type: Number,
    example: 1,
  })
  @IsNumber()
  @Transform(({ value }) => +value)
  characterId: number;
}
