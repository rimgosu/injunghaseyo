import { PickType } from '@nestjs/swagger';
import { BaseUseraAuthDto } from './base.dto';

export class SignInParams extends PickType(BaseUseraAuthDto, [
  'email',
  'password',
]) {}
