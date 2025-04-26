import { IntersectionType, PickType } from '@nestjs/swagger';
import { BaseUseraAuthDto } from './base.dto';
import { User } from '@prisma/client';
import { ICheckLevelUpReturnType } from '@/character/utils/types';
import { BaseCharacterDto } from '../../character/dtos/base-character.dto';

export class GetCheckSignIn extends IntersectionType(
  PickType(BaseUseraAuthDto, ['userStatus', 'userId']),
  PickType(BaseCharacterDto, ['checkLevelUpResult']),
) {
  constructor(user: User, checkLevelUpResult: ICheckLevelUpReturnType | void) {
    super();
    this.userStatus = user.status;
    this.checkLevelUpResult = checkLevelUpResult;
    this.userId = user.id;
  }
}
