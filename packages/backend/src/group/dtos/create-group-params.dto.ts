import { PickType } from '@nestjs/swagger';
import { BaseGroupDto } from './base.dto';

export class CreateGroupParams extends PickType(BaseGroupDto, [
  'title',
  'price',
  'proofMethod',
  'dates',
  'tags',
  'description',
]) {}
