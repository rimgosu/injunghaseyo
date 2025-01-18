import { PickType } from '@nestjs/swagger';
import { BaseGroup } from './base.dto';

export class GetTodayQuery extends PickType(BaseGroup, ['today']) {}
