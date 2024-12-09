import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { VerifyEmailParam } from './dtos/verify-email-param.dto';
import { generateVerificationCode } from './auth.helper';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EmailService } from 'src/email/email.service';
import { VerifyCodeParams } from './dtos/verify-code-params.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly emailService: EmailService,
  ) {}

  async verifyCode(params: VerifyCodeParams) {
    const { email, code } = params;

    const cachedCode = await this.cacheManager.get(`code:${email}`);

    if (cachedCode !== code)
      throw new UnauthorizedException('잘못된 인증 코드');

    await this.cacheManager.set(`verified:${email}`, 1, 60 * 30 * 1000); // 30분 이내로 가입 마치면 된다.

    return { message: `${email}: verified` };
  }

  async verifyEmail(param: VerifyEmailParam) {
    const { email } = param;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user) throw new ConflictException('이메일 중복');

    const authCode = generateVerificationCode();

    await this.cacheManager.set(`code:${email}`, authCode);

    await this.emailService.sendVerificationEmail(email, authCode);
  }
}
