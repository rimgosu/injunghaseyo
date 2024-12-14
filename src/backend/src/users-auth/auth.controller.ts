import {
  Controller,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyEmailParam } from './dtos/verify-email-param.dto';
import { VerifyCodeParams } from './dtos/verify-code-params.dto';
import { SignUpParam } from './dtos/sign-up-params.dto';
import { SignInParams } from './dtos/sign-in-params.dto';
import { SignInRes } from './dtos/sign-in-res.dto';
import { Response } from 'express';
import { RtkGuard } from './guards/rtk.guard';
import { ReissueAtkRes } from './dtos/reissue-atk-res.dto';
import { FindPasswordParam } from './dtos/find-password-param.dto';

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

  /**
   * @description atk 재발급
   *
   * - 유효한 refresh token이 필요하다.
   */
  @Post('reissue-atk')
  @UseGuards(RtkGuard)
  async reissueAtk(@Request() req): Promise<ReissueAtkRes> {
    return await this.authService.reissueAtk(req.user);
  }

  /**
   * @description 비밀번호 찾기
   * @see sign-in 로그인 시 redis에 있는 임시 비밀번호부터 체크하도록 한다.
   *
   * - 비밀번호 있는 유저만 가능
   */
  @Post('find-password')
  async findPassword(@Query() findPasswordParam: FindPasswordParam) {
    return await this.authService.findPassword(findPasswordParam);
  }
}
