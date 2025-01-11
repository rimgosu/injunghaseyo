import { PickType } from '@nestjs/swagger';
import { BaseUseraAuthDto } from './base.dto';

export class VerifyPasswordParams extends PickType(BaseUseraAuthDto, [
  'password',
]) {}
