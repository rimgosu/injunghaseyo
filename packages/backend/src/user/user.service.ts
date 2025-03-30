import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetMoneyDto } from './dtos/get-money.dto';
import { GetProfileResDto } from './dtos/get-profile-res.dto';
import { USER_WITH_JOIN } from './utils/types';
import { S3Service } from '@/s3/s3.service';
import { DeleteProfilePhotoParam } from './dtos/delete-profile-photo-param.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
  ) {}

  /**
   * @description 유저 프로필 사진을 삭제합니다.
   *
   * - 데이터베이스에서만 삭제하고, s3에서는 삭제하지 않습니다.
   */
  async deleteProfilePhoto(user: User, param: DeleteProfilePhotoParam) {
    return await this.prisma.profilePhoto.delete({
      where: {
        id: param.profilePhotoId,
        userId: user.id,
      },
    });
  }

  /**
   * @description 유저 프로필 사진을 업로드 합니다.
   */
  async addProfilePhoto(user: User, profilePhoto: Express.Multer.File) {
    const uploadUrl = await this.s3.uploadFile(
      profilePhoto,
      `${this.s3.profilePhotoDir}:${user.email}:${new Date().toISOString()}`,
    );

    await this.prisma.profilePhoto.create({
      data: {
        url: uploadUrl,
        userId: user.id,
      },
    });
  }

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
