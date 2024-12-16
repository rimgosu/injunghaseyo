import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthHelper } from './auth.helper';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './guards/atk.strategy';
import { RefreshTokenStrategy } from './guards/rtk.strategy';
import { GoogleStrategy } from './guards/google.strategy';

@Module({
  controllers: [UsersController, AuthController],
  providers: [
    UsersService,
    AuthService,
    AuthHelper,
    JwtService,
    JwtStrategy,
    RefreshTokenStrategy,
    GoogleStrategy,
  ],
})
export class UsersAuthModule {}
