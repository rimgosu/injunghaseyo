import { AtkGuard } from '@/auth/guards/atk.guard';
import { RoleGuard } from '@/auth/guards/role.guard';
import { GetUser } from '@/common/get-user.decorator';
import { Post, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GainAdminRoleParam } from './dtos/gain-admin-role-param.dto';
import { GainMoneyParam } from './dtos/gain-money-param.dto';
import { UserMgmtService } from './user-mgmt.service';

export class UserMgmtController {
  constructor(private readonly userMgmtService: UserMgmtService) {}

  /**
   * @description 관리자 권한을 얻습니다.
   */
  @Post('admin')
  @UseGuards(AtkGuard)
  @ApiBearerAuth('jwt')
  async getAdminRole(
    @Query() param: GainAdminRoleParam,
    @GetUser() user: User,
  ) {
    return this.userMgmtService.getAdminRole(user);
  }

  /**
   * @description 인증머니를 원하는 만큼 얻습니다.
   */
  @Post('gain-money')
  @UseGuards(RoleGuard)
  @ApiBearerAuth('jwt')
  async gainMoney(@Query() param: GainMoneyParam, @GetUser() user: User) {
    return this.userMgmtService.gainMoney(user, param);
  }
}
