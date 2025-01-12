import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AtkGuard } from '@/auth/guards/atk.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { GetUser } from '@/common/get-user.decorator';
import { User } from '@prisma/client';
import { GetMoneyDto } from './dtos/get-money.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
