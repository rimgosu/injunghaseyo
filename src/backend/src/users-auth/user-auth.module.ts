import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthHelper } from './auth.helper';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './guards/jwt.strategy';
import { AtkGuard } from './guards/atk.guard';

@Module({
  controllers: [UsersController, AuthController],
  providers: [
    UsersService,
    AuthService,
    AuthHelper,
    JwtService,
    JwtStrategy,
    AtkGuard,
  ],
})
export class UsersAuthModule {}
