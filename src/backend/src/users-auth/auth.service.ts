import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VerifyEmailParam } from './dtos/verify-email-param.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async verifyEmail(param: VerifyEmailParam) {
    const { email } = param;
    const user = this.prisma.user.findUnique({ where: { email } });
    if (user) throw new ConflictException('이메일 중복');
  }
}
