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
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { OauthUser } from './utils/types';
import { ActivateOauthParams } from './dtos/activate-oauth-params.dto';
import { VerifyNicknameParam } from './dtos/verify-nickname-params.dto';
import { VerifyPasswordParams } from './dtos/verify-password.dto';
import { GetCheckSignIn } from './dtos/get-check-sign-in.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

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
   * @description 올바른 패스워드인지 확인
   */
  @Get('verify-password')
  async verifyPassword(@Query() param: VerifyPasswordParams) {
    return this.authService.verifyPassword(param);
  }

  /**
   * @description nickname 중복 확인
   */
  @Get('verify-nickname')
  async verifyNickname(@Query() param: VerifyNicknameParam) {
    return await this.authService.verifyNickname(param);
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
   *
   * - access token: response로 준다.
   * - refresh token: 쿠키에 '_SESSION' 이름으로 주입한다.
   */
  @Post('sign-in')
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: SignInRes,
  })
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
   * @description 로그아웃
   *
   * - access token: blacklist 추가
   * - refresh token: 쿠키 회수
   */
  @Post('sign-out')
  @UseGuards(AtkGuard)
  @ApiBearerAuth('jwt')
  async signOut(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
    @Request() req: any,
  ) {
    const accessToken: string = req.headers.authorization.split(' ')[1];
    await this.authService.signOut(user, accessToken);
    res.clearCookie('_SESSION');
    return { message: '로그아웃 성공' };
  }

  /**
   * @description 로그인 상태 확인
   */
  @Get('check-sign-in')
  @UseGuards(AtkGuard)
  @ApiBearerAuth('jwt')
  @ApiResponse({
    status: 200,
    description: '로그인 상태 확인 성공',
    type: GetCheckSignIn,
  })
  async checkSignIn(@GetUser() user: User): Promise<GetCheckSignIn> {
    return await this.authService.checkSignIn(user);
  }

  /**
   * @description atk 재발급
   *
   * - 유효한 refresh token이 필요하다.
   */
  @Post('reissue-atk')
  @UseGuards(RtkGuard)
  @ApiResponse({
    status: 200,
    description: 'atk 재발급 성공',
    type: ReissueAtkRes,
  })
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
  async googleAuthRedirect(@GetUser() user: OauthUser, @Res() res: Response) {
    const result = await this.authService.oauthLogin(user, Provider.GOOGLE);
    res.cookie('_SESSION', result.generatedJwt.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30일
    });
    res.redirect(
      `${this.configService.get('callbackUrl')}?accessToken=${result.generatedJwt.accessToken}`,
    );
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
  async kakaoCallback(@GetUser() user: OauthUser, @Res() res: Response) {
    const result = await this.authService.oauthLogin(user, Provider.KAKAO);
    res.cookie('_SESSION', result.generatedJwt.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30일
    });
    res.redirect(
      `${this.configService.get('callbackUrl')}?accessToken=${result.generatedJwt.accessToken}`,
    );
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
  async naverCallback(@GetUser() user: OauthUser, @Res() res: Response) {
    const result = await this.authService.oauthLogin(user, Provider.NAVER);
    res.cookie('_SESSION', result.generatedJwt.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30일
    });
    res.redirect(
      `${this.configService.get('callbackUrl')}?accessToken=${result.generatedJwt.accessToken}`,
    );
  }

  /**
   * @description oauth 대기 상태를 해제한다.
   */
  @Post('activate-oauth')
  @UseGuards(AuthGuard('oauth-pending'))
  @ApiBearerAuth('jwt')
  async activateOauth(
    @GetUser() user: User,
    @Query() params: ActivateOauthParams,
  ) {
    return await this.authService.activateOauth(user, params);
  }
}
