import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AtkGuard } from '@/auth/guards/atk.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';
import { GetUser } from '@/common/get-user.decorator';
import { User } from '@prisma/client';
import { GetMoneyDto } from './dtos/get-money.dto';
import { GetProfileResDto } from './dtos/get-profile-res.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteProfilePhotoParam } from './dtos/delete-profile-photo-param.dto';
import { GetOtherProfileResDto } from './dtos/get-other-profile-res.dto';
import { UpdateUserQuery } from './dtos/update-user-query.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * @description 유저 정보를 수정합니다.
   */
  @Put()
  @UseGuards(AtkGuard)
  @ApiBearerAuth('jwt')
  async updateUser(@GetUser() user: User, @Query() query: UpdateUserQuery) {
    return this.userService.updateUser(user, query);
  }

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
   * @description 다른 유저의 프로필을 조회합니다.
   */
  @Get(':userId/profile')
  @ApiResponse({
    status: 200,
    type: GetOtherProfileResDto,
    description: '다른 유저의 프로필',
  })
  async getOtherProfile(
    @Param('userId') userId: number,
  ): Promise<GetOtherProfileResDto> {
    return this.userService.getOtherProfile(userId);
  }

  /**
   * @description 유저 프로필 사진을 추가합니다.
   */
  @Post('profile-photo')
  @UseGuards(AtkGuard)
  @ApiBearerAuth('jwt')
  @UseInterceptors(FileInterceptor('profilePhoto'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profilePhoto: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async addProfilePhoto(
    @GetUser() user: User,
    @UploadedFile() profilePhoto: Express.Multer.File,
  ): Promise<void> {
    return this.userService.addProfilePhoto(user, profilePhoto);
  }

  /**
   * @description 유저 프로필 사진을 삭제합니다.
   */
  @Delete('profile-photo/:profilePhotoId')
  @UseGuards(AtkGuard)
  @ApiBearerAuth('jwt')
  async deleteProfilePhoto(
    @Param() param: DeleteProfilePhotoParam,
    @GetUser() user: User,
  ) {
    return this.userService.deleteProfilePhoto(param, user);
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
