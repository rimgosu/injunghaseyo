import { Controller, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyEmailParam } from './dtos/verify-email-param.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify-email')
  async verifyEmail(@Param() param: VerifyEmailParam) {
    return this.authService.verifyEmail(param);
  }

  // @Post('sign-up')
  // async signUp() {}
}
