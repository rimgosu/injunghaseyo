import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class BaseCursorPaginationQueryDto {
  @ApiProperty({
    required: false,
    description: '페이지 당 아이템 수',
    default: 20,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => +value)
  take?: number;

  @ApiProperty({
    required: false,
    description: '마지막 아이템의 id',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => +value)
  cursor?: number;
}
