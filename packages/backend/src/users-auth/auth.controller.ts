import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
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
import { ChgPasswordParams } from './dtos/chg-password-params.dto';
import { AtkGuard } from './guards/atk.guard';
import { GetUser } from '@/common/get-user.decorator';
import { Provider, User } from '@prisma/client';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { OauthUser } from './utils/types';

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
   * @todo 프로필 photo 업데이트
   */
  @Post('sign-up')
  async signUp(@Query() param: SignUpParam) {
    return this.authService.signUp(param);
  }

  /**
   * @description 로그인
   * @todo e2e test
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

  /**
   * @description 비밀번호 변경
   */
  @Patch('change-password')
  @UseGuards(AtkGuard)
  @ApiBearerAuth('jwt')
  async changePassword(
    @Query() chgPasswordParams: ChgPasswordParams,
    @GetUser() user: User,
  ) {
    return await this.authService.changePassword(chgPasswordParams, user);
  }

  /**
   * @description 회원 탈퇴
   */
  @Delete('withdraw')
  @UseGuards(AtkGuard)
  @ApiBearerAuth('jwt')
  async withdraw(@GetUser() user: User) {
    return await this.authService.withdraw(user);
  }

  /**
   * @description google oauth
   */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @HttpCode(301)
  async googleAuth() {}

  /**
   * @description google oauth callback
   */
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ deprecated: true })
  async googleAuthRedirect(@GetUser() user: OauthUser) {
    return await this.authService.oauthLogin(user, Provider.GOOGLE);
  }

  /**
   * @description kakao login
   */
  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  @HttpCode(301)
  async kakaoLogin() {}

  /**
   * @description kakao oauth callback
   */
  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({ deprecated: true })
  async kakaoCallback(@GetUser() user: OauthUser) {
    return await this.authService.oauthLogin(user, Provider.KAKAO);
  }

  /**
   * @description naver login
   */
  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  @HttpCode(301)
  async naverLogin() {}

  /**
   * @description naver login callback
   */
  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  @ApiOperation({ deprecated: true })
  async naverCallback(@GetUser() user: OauthUser) {
    return await this.authService.oauthLogin(user, Provider.NAVER);
  }
}
