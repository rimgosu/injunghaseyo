import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsNumberString } from 'class-validator';
import { BaseUseraAuthDto } from './base.dto';

export class VerifyCodeParams extends PickType(BaseUseraAuthDto, [
  'email',
  'code',
]) {}
