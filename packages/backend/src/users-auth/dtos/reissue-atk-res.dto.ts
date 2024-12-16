import { PickType } from '@nestjs/swagger';
import { BaseUseraAuthDto } from './base.dto';

export class ReissueAtkRes extends PickType(BaseUseraAuthDto, ['accessToken']) {
  constructor(accessToken: string) {
    super();
    this.accessToken = accessToken;
  }
}
