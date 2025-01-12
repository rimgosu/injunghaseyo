import { PickType } from '@nestjs/swagger';
import { BaseGroup } from './base.dto';

export class CreateGroupParams extends PickType(BaseGroup, [
  'title',
  'price',
  'proofMethod',
  'dates',
  'tags',
  'description',
]) {}
