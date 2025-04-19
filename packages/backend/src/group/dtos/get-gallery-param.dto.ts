import { PickType } from '@nestjs/swagger';
import { BaseGroup } from './base.dto';

export class GetGalleryParam extends PickType(BaseGroup, ['groupId']) {}
