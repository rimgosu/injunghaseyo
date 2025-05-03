import { PickType } from '@nestjs/swagger';
import { BaseProofReq } from './base';

export class GetProofQuery extends PickType(BaseProofReq, ['groupId']) {}
