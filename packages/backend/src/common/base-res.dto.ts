import { ApiProperty } from '@nestjs/swagger';

export class BaseResDto {
  @ApiProperty({
    description: '내가 만든 것인지 여부',
    example: true,
    type: Boolean,
  })
  canMutation: boolean;
}
