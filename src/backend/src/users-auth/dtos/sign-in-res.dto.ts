import { PickType } from '@nestjs/swagger';
import { BaseUseraAuthDto } from './base.dto';

export class SignInRes extends PickType(BaseUseraAuthDto, [
  'email',
  'accessToken',
]) {
  constructor(email: string, accessToken: string) {
    super();
    this.email = email;
    this.accessToken = accessToken;
  }
}
