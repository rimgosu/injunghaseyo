import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { VerifyEmailParam } from './dtos/verify-email-param.dto';
import { generateVerificationCode } from './auth.helper';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async verifyEmail(param: VerifyEmailParam) {
    const { email } = param;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user) throw new ConflictException('이메일 중복');

    const authCode = generateVerificationCode();

    await this.cacheManager.set(email, authCode);
  }
}
