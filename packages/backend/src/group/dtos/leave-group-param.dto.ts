import { PickType } from '@nestjs/swagger';
import { BaseGroup } from './base.dto';

export class LeaveGroupParam extends PickType(BaseGroup, ['groupId']) {}
