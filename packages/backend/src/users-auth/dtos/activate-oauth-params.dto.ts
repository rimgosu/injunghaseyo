import { PickType } from '@nestjs/swagger';
import { BaseUseraAuthDto } from './base.dto';

export class ActivateOauthParams extends PickType(BaseUseraAuthDto, [
  'eventAgree',
  'requireAgree',
  'nickname',
]) {}
