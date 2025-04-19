import { PickType } from '@nestjs/swagger';
import { BaseGroupRes } from './base-res.dto';

export class GetGalleryRes extends PickType(BaseGroupRes, [
  'participantForGallery',
]) {}
