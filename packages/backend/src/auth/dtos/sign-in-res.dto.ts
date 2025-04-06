import { IntersectionType, PickType } from '@nestjs/swagger';
import { BaseUseraAuthDto } from './base.dto';
import { BaseCharacterDto } from './base-character.dto';
import { ICheckLevelUpReturnType } from '@/character/utils/types';

export class SignInRes extends IntersectionType(
  PickType(BaseUseraAuthDto, ['email', 'accessToken']),
  PickType(BaseCharacterDto, ['checkLevelUpResult']),
) {
  constructor(
    email: string,
    accessToken: string,
    checkLevelUpResult: ICheckLevelUpReturnType | void,
  ) {
    super();
    this.email = email;
    this.accessToken = accessToken;
    this.checkLevelUpResult = checkLevelUpResult;
  }
}
