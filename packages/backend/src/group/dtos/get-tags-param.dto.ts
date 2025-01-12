import { PickType } from '@nestjs/swagger';
import { BaseGroup } from './base.dto';

export class GetTagsParams extends PickType(BaseGroup, [
  'tagSearch',
  'selectedTags',
]) {}
