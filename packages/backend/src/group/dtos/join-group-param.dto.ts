import { PickType } from '@nestjs/swagger';
import { BaseGroupDto } from './base.dto';

export class JoinGroupParam extends PickType(BaseGroupDto, ['groupId']) {}
