import { PickType } from '@nestjs/swagger';
import { BaseGroup } from './base.dto';

export class GetGroupParam extends PickType(BaseGroup, ['groupId']) {}
