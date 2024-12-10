import { PickType } from '@nestjs/swagger';
import { BaseUseraAuthDto } from './base.dto';

export class VerifyEmailParam extends PickType(BaseUseraAuthDto, ['email']) {}
