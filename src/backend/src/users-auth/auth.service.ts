import {
  ConflictException,
  Inject,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { VerifyEmailParam } from './dtos/verify-email-param.dto';
import { generateVerificationCode, hashPassword } from './auth.helper';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { VerifyCodeParams } from './dtos/verify-code-params.dto';
import { EmailService } from '@/email/email.service';
import { PrismaService } from '@/prisma/prisma.service';
import { SignUpParam } from './dtos/sign-up-params.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly emailService: EmailService,
  ) {}

  async signUp(param: SignUpParam) {
    const { email, eventAgree, nickname, password } = param;

    const [userByEmail, userByNickname] = await Promise.all([
      this.prisma.user.findUnique({ where: { email } }),
      this.prisma.user.findUnique({ where: { nickname } }),
    ]);
    if (userByEmail) throw new ConflictException('이메일 중복');
    if (userByNickname) throw new ConflictException('닉네임 중복');

    const verified = await this.cacheManager.get(`verified:${email}`);
    if (!verified) throw new NotAcceptableException('인증코드 확인 필요');

    const { hashedPassword, salt } = await hashPassword(password);

    return this.prisma.user.create({
      data: {
        email,
        eventAgree,
        nickname,
        password: hashedPassword,
        salt: salt,
      },
      select: {
        email: true,
        eventAgree: true,
        nickname: true,
      },
    });
  }

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
