import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthHelper } from './utils/auth.helper';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './guards/atk.strategy';
import { RefreshTokenStrategy } from './guards/rtk.strategy';
import { GoogleStrategy } from './guards/google.strategy';
import { KakaoStrategy } from './guards/kakao.strategy';
import { NaverStrategy } from './guards/naver.strategy';
import { OauthPendingStrategy } from './guards/oauth-pending.strategy';
import { CharacterSelectStrategy } from './guards/character-choose.strategy';
import { RoleStrategy } from './guards/role.strategy';
import { AtkOptionalStrategy } from './guards/atk-optional.strategy';

@Global()
@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthHelper,
    JwtService,
    JwtStrategy,
    RefreshTokenStrategy,
    GoogleStrategy,
    KakaoStrategy,
    NaverStrategy,
    OauthPendingStrategy,
    CharacterSelectStrategy,
    RoleStrategy,
    AtkOptionalStrategy,
  ],
})
export class AuthModule {}
