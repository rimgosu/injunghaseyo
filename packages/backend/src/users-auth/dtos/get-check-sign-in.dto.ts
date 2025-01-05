import { PickType } from '@nestjs/swagger';
import { BaseUseraAuthDto } from './base.dto';
import { User } from '@prisma/client';

export class GetCheckSignIn extends PickType(BaseUseraAuthDto, ['userStatus']) {
  constructor(user: User) {
    super();
    this.userStatus = user.status;
  }
}
