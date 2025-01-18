import { PickType } from '@nestjs/swagger';
import { BaseGroup } from './base.dto';

export class GetTodayParam extends PickType(BaseGroup, ['groupId']) {}
