import { CharacterWithInfo } from '../utils/types';

class CharacterInfo {
  level: number;
  photoUrl: string;

  constructor(level: number, photoUrl: string) {
    this.level = level;
    this.photoUrl = photoUrl;
  }
}

export class GetCharacter {
  id: number;
  name: string;
  characterInfos: CharacterInfo[];

  constructor(character: CharacterWithInfo) {
    const { id, name, characterInfo } = character;

    this.id = id;
    this.name = name;
    this.characterInfos = characterInfo.map(
      (info) => new CharacterInfo(info.level, info.photoUrl),
    );
  }
}
