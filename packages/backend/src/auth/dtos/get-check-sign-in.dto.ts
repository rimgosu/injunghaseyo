import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { BaseUseraAuthDto } from './base.dto';
import { User } from '@prisma/client';
import { ICheckLevelUpReturnType } from '@/character/utils/types';
import { BaseCharacterDto } from '../../character/dtos/base-character.dto';

export class GetCheckSignIn extends IntersectionType(
  PickType(BaseUseraAuthDto, ['userStatus', 'userId']),
  PickType(BaseCharacterDto, ['checkLevelUpResult']),
) {
  @ApiProperty({
    description: '프로필 사진',
    example: 'https://example.com/profile.jpg',
  })
  profilePhoto: string;

  constructor(
    user: User,
    checkLevelUpResult: ICheckLevelUpReturnType | void,
    profilePhoto: string,
  ) {
    super();
    this.userStatus = user.status;
    this.checkLevelUpResult = checkLevelUpResult;
    this.userId = user.id;
    this.profilePhoto = profilePhoto;
  }
}
