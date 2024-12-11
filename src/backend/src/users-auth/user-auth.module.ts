import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthHelper } from './auth.helper';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UsersController, AuthController],
  providers: [UsersService, AuthService, AuthHelper, JwtService],
})
export class UsersAuthModule {}
