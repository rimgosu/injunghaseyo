import { PickType } from '@nestjs/swagger';
import { BaseUseraAuthDto } from './base.dto';

export class ChgPasswordParams extends PickType(BaseUseraAuthDto, [
  'password',
  'changePassword',
  'confirmChangePassword',
]) {}
