import { PickType } from '@nestjs/swagger';
import { BaseGroup } from './base.dto';

export class GetTodayRewardParam extends PickType(BaseGroup, ['groupId']) {}
