import { PickType } from '@nestjs/swagger';
import { BaseUserDto } from './base';

export class GainMoneyParam extends PickType(BaseUserDto, ['money']) {}
