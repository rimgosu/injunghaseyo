import { PickType } from '@nestjs/swagger';
import { BaseProofReq } from './base';

export class UpdateCommentBody extends PickType(BaseProofReq, ['contents']) {}
