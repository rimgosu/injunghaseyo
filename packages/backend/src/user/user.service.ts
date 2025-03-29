import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetMoneyDto } from './dtos/get-money.dto';
import { GetProfileResDto } from './dtos/get-profile-res.dto';
import { USER_WITH_JOIN } from './utils/types';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @description 유저 프로필을 조회합니다.
   */
  async getProfile(user: User): Promise<GetProfileResDto> {
    const userData = await this.prisma.user.findUnique({
      where: { id: user.id, deletedAt: null },
      ...USER_WITH_JOIN,
    });

    if (!userData) throw new NotFoundException('유저를 찾을 수 없습니다.');

    return new GetProfileResDto(userData);
  }

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
