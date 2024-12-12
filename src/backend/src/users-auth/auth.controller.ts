import { Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyEmailParam } from './dtos/verify-email-param.dto';
import { VerifyCodeParams } from './dtos/verify-code-params.dto';
import { SignUpParam } from './dtos/sign-up-params.dto';
import { SignInParams } from './dtos/sign-in-params.dto';
import { SignInRes } from './dtos/sign-in-res.dto';
import { Response } from 'express';
import { AtkGuard } from './guards/atk.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @description 이메일 중복 확인 -> 인증 코드 생성 후 redis 저장 -> 인증 코드 이메일 송신
   *
   * redis: code:${email}
   */
  @Post('verify-email')
  async verifyEmail(@Query() param: VerifyEmailParam) {
    return this.authService.verifyEmail(param);
  }

  /**
   * @description 인증 코드 확인
   *
   * redis: verified:${email}
   */
  @Post('verify-code')
  async verifyCode(@Query() param: VerifyCodeParams) {
    return this.authService.verifyCode(param);
  }

  /**
   * @description 회원 가입
   */
  @Post('sign-up')
  async signUp(@Query() param: SignUpParam) {
    return this.authService.signUp(param);
  }

  /**
   * @description 로그인
   *
   * - access token: response로 준다.
   * - refresh token: 쿠키에 '_SESSION' 이름으로 주입한다.
   */
  @Post('sign-in')
  async signIn(
    @Query() param: SignInParams,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignInRes> {
    const { email, generatedJwt } = await this.authService.signIn(param);
    const { accessToken, refreshToken } = generatedJwt;

    res.cookie('_SESSION', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30일
    });

    return new SignInRes(email, accessToken);
  }

  @UseGuards(AtkGuard)
  @ApiBearerAuth('jwt')
  @Get()
  async test() {
    return 'good';
  }
}
