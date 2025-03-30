import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class DeleteProfilePhotoParam {
  @ApiProperty({
    description: '프로필 사진 id',
    example: 1,
    type: Number,
  })
  @IsNumber()
  @Transform(({ value }) => +value)
  profilePhotoId: number;
}
