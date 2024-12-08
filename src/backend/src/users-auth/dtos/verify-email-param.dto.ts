import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class VerifyEmailParam {
  @ApiProperty({
    description: 'email',
    type: String,
  })
  @IsEmail()
  email: string;
}
