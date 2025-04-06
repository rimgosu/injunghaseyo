import { BaseCharacterDto } from '@/auth/dtos/base-character.dto';
import { ICheckLevelUpReturnType } from '@/character/utils/types';
import { PickType } from '@nestjs/swagger';

export class UploadProofRes extends PickType(BaseCharacterDto, [
  'checkLevelUpResult',
]) {
  constructor(checkLevelUpResult: ICheckLevelUpReturnType | void) {
    super();
    this.checkLevelUpResult = checkLevelUpResult;
  }
}
