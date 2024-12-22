import { PickType } from '@nestjs/swagger';
import { BaseGroupDto } from './base.dto';

export class GetTagsParams extends PickType(BaseGroupDto, [
  'tagSearch',
  'selectedTags',
]) {}
