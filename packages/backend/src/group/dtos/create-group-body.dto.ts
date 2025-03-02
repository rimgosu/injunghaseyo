import { PickType } from '@nestjs/swagger';
import { BaseGroup } from './base.dto';

export class CreateGroupBody extends PickType(BaseGroup, ['proofMethods']) {}
