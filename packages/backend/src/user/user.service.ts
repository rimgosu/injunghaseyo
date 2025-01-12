import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetMoneyDto } from './dtos/get-money.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @description 보유한 인증 머니를 조회합니다.
   */
  async getMoney(user: User): Promise<GetMoneyDto> {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: user.id },
    });

    if (!wallet) throw new NotFoundException('인증 머니가 없습니다.');

    return new GetMoneyDto(wallet);
  }
}
