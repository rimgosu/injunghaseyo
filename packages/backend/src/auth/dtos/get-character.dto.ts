import { ApiProperty } from '@nestjs/swagger';
import { CharacterWithInfo } from '../utils/types';

class CharacterInfo {
  @ApiProperty({
    description: '캐릭터 레벨',
    example: 1,
    type: Number,
  })
  level: number;

  @ApiProperty({
    description: '캐릭터 이미지 URL',
    example: 'https://example.com/image.jpg',
    type: String,
  })
  photoUrl: string;

  constructor(level: number, photoUrl: string) {
    this.level = level;
    this.photoUrl = photoUrl;
  }
}

export class GetCharacter {
  @ApiProperty({
    description: '캐릭터 ID',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: '캐릭터 이름',
    example: '캐릭터 이름',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: '캐릭터 정보',
    type: [CharacterInfo],
  })
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
