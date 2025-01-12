import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AtkGuard } from '@/auth/guards/atk.guard';
import { GainAdminRoleParam } from './dtos/gain-admin-role-param.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { GetUser } from '@/common/get-user.decorator';
import { User } from '@prisma/client';
import { RoleGuard } from '@/auth/guards/role.guard';
import { GainMoneyParam } from './dtos/gain-money-param.dto';
import { GetMoneyDto } from './dtos/get-money.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
    return this.userService.getAdminRole(user);
  }

  /**
   * @description 인증머니를 원하는 만큼 얻습니다.
   */
  @Post('gain-money')
  @UseGuards(RoleGuard)
  @ApiBearerAuth('jwt')
  async gainMoney(@Query() param: GainMoneyParam, @GetUser() user: User) {
    return this.userService.gainMoney(user, param);
  }

  /**
   * @description 인증 머니를 조회합니다.
   */
  @Get('money')
  @UseGuards(AtkGuard)
  @ApiBearerAuth('jwt')
  @ApiResponse({
    type: GetMoneyDto,
    description: '보유한 인증 머니',
  })
  async getMoney(@GetUser() user: User): Promise<GetMoneyDto> {
    return this.userService.getMoney(user);
  }
}
