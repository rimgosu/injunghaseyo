import { PickType } from '@nestjs/swagger';
import { BaseUseraAuthDto } from './base.dto';

export class SignUpParam extends PickType(BaseUseraAuthDto, [
  'email',
  'nickname',
  'password',
  'confirmPassword',
  'requireAgree',
  'eventAgree',
]) {}
