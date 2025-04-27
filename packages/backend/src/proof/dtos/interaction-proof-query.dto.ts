import { ApiProperty } from '@nestjs/swagger';
import { InteractionType } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class InteractionProofQuery {
  @ApiProperty({
    enum: InteractionType,
    description: '좋아요 타입',
    example: InteractionType.LIKE,
  })
  @IsEnum(InteractionType)
  type: InteractionType;
}
