import { PickType } from '@nestjs/swagger';
import { BaseGroup } from './base.dto';

export class UploadProofParam extends PickType(BaseGroup, ['groupId']) {}

export class UploadProofQuery extends PickType(BaseGroup, [
  'progressId',
  'today',
]) {}
