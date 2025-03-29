import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AtkGuard } from '@/auth/guards/atk.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { GetUser } from '@/common/get-user.decorator';
import { User } from '@prisma/client';
import { GetMoneyDto } from './dtos/get-money.dto';
import { GetProfileResDto } from './dtos/get-profile-res.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * @description 유저 프로필을 조회합니다.
   *
   * - 인증머니
   * - 총 인증한 일 수
   * - 진행중인 인증
   * - 예약한 인증
   * - 완료한 인증
   */
  @Get('profile')
  @UseGuards(AtkGuard)
  @ApiBearerAuth('jwt')
  @ApiResponse({
    status: 200,
    type: GetProfileResDto,
    description: '유저 프로필',
  })
  async getProfile(@GetUser() user: User): Promise<GetProfileResDto> {
    return this.userService.getProfile(user);
  }

  /**
   * @description 인증 머니를 조회합니다.
   */
  @Get('money')
  @UseGuards(AtkGuard)
  @ApiBearerAuth('jwt')
  @ApiResponse({
    status: 200,
    type: GetMoneyDto,
    description: '보유한 인증 머니',
  })
  async getMoney(@GetUser() user: User): Promise<GetMoneyDto> {
    return this.userService.getMoney(user);
  }
}
