import { PickType } from '@nestjs/swagger';
import { BaseUserDto } from './base';

export class GainAdminRoleParam extends PickType(BaseUserDto, ['auth']) {}
