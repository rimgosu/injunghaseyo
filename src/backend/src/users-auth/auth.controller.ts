import { Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyEmailParam } from './dtos/verify-email-param.dto';
import { VerifyCodeParams } from './dtos/verify-code-params.dto';
import { SignUpParam } from './dtos/sign-up-params.dto';

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

  @Post('sign-up')
  async signUp(@Query() param: SignUpParam) {
    return this.authService.signUp(param);
  }
}
