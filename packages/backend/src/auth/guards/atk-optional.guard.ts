import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AtkOptionalGuard extends AuthGuard('atk-optional') {
  handleRequest<TUser = any>(err: any, user: any): TUser {
    return user;
  }
}
