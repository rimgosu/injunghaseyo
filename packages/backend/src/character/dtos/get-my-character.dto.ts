import { ApiProperty } from '@nestjs/swagger';
import { MyCharacterCharacterInfo } from '../utils/types';

export class GetMyCharacter {
  @ApiProperty({
    description: 'my character id',
    type: Number,
    example: 1,
  })
  myCharacterId: number;

  @ApiProperty({
    description: '현재 레벨',
    type: Number,
    example: 2,
  })
  currentLevel: number;

  @ApiProperty({
    description: '현재 경험치',
    type: Number,
    example: 125,
  })
  currentExp: number;

  @ApiProperty({
    description: '다음 레벨 경험치',
    type: Number,
    example: 200,
  })
  nextExp: number;

  @ApiProperty({
    description: '이전 레벨 경험치',
    type: Number,
    example: 100,
  })
  previousExp: number;

  @ApiProperty({
    description: '캐릭터 이름',
    type: String,
    example: '캐릭터 이름',
  })
  name: string;

  @ApiProperty({
    description: '캐릭터 이미지',
    type: String,
    example: 'https://example.com/image.png',
  })
  characterImage: string;

  constructor(myCharacter: MyCharacterCharacterInfo) {
    this.myCharacterId = myCharacter.id;
    this.currentLevel = myCharacter.character.characterInfo[0].level;
    this.currentExp = myCharacter.totalExp;
    this.nextExp = myCharacter.character.characterInfo[0].nextExpNeed;
    this.previousExp = myCharacter.character.characterInfo[0].expNeed;
    this.name = myCharacter.character.name;
    this.characterImage = myCharacter.character.characterInfo[0].photoUrl;
  }
}
