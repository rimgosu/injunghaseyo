import { PickType } from '@nestjs/swagger';
import { BaseCharacterDto } from './base-character.dto';

export class CharacterSelectParam extends PickType(BaseCharacterDto, [
  'characterId',
]) {}
