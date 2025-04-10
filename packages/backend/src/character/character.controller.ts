import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterSelectParam } from '@/character/dtos/character-select-param.dto';
import { GetCharacter } from '@/auth/dtos/get-character.dto';
import { GetUser } from '@/common/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';

@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  /**
   * @description 전체 character를 조회한다.
   */
  @Get()
  @UseGuards(AuthGuard('character-select'))
  @ApiBearerAuth('jwt')
  @ApiResponse({
    status: 200,
    description: '전체 character 조회 성공',
    type: [GetCharacter],
  })
  async getCharacters(): Promise<GetCharacter[]> {
    return await this.characterService.getCharacters();
  }

  /**
   * @description character를 선택한다.
   *
   * - 유저는 캐릭터를 선택한다.
   * - 유저 status를 ACTIVE로 변경한다.
   */
  @Post('select')
  @UseGuards(AuthGuard('character-select'))
  @ApiBearerAuth('jwt')
  async characterSelect(
    @GetUser() user: User,
    @Query() param: CharacterSelectParam,
  ) {
    return await this.characterService.characterSelect(user, param);
  }
}
