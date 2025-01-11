import { PickType } from '@nestjs/swagger';
import { BaseUseraAuthDto } from './base.dto';

export class VerifyNicknameParam extends PickType(BaseUseraAuthDto, [
  'nickname',
]) {}
