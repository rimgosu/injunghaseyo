import { PickType } from '@nestjs/swagger';
import { BaseUseraAuthDto } from './base.dto';

export class FindPasswordParam extends PickType(BaseUseraAuthDto, ['email']) {}
