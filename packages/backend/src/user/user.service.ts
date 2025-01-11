import { PrismaService } from '@/prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { GainMoneyParam } from './dtos/gain-money-param.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @description 인증머니를 원하는 만큼 얻습니다.
   */
  async gainMoney(user: User, param: GainMoneyParam) {
    const { money } = param;

    return await this.prisma.wallet.update({
      where: {
        userId: user.id,
        deletedAt: null,
      },
      data: {
        money: {
          increment: money,
        },
      },
      select: {
        money: true,
      },
    });
  }

  /**
   * @description 관리자 권한을 얻습니다.
   */
  async getAdminRole(user: User) {
    if (user.email !== 'newnyup@gmail.com')
      throw new ForbiddenException('관리자 권한을 얻을 수 없습니다.');

    const { uuid } = user;
    return await this.prisma.user.update({
      where: {
        uuid,
        deletedAt: null,
      },
      data: {
        role: Role.ADMIN,
      },
      select: {
        email: true,
        role: true,
      },
    });
  }
}
