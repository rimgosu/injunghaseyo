import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumberString } from 'class-validator';

export class VerifyCodeParams {
  @ApiProperty({
    description: 'email',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'auth code',
    type: String,
  })
  @IsNumberString()
  code: string;
}
