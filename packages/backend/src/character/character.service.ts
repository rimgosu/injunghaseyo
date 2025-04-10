import { CharacterSelectParam } from '@/character/dtos/character-select-param.dto';
import { GetCharacter } from '@/auth/dtos/get-character.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserStatus } from '@prisma/client';

@Injectable()
export class CharacterService {
  constructor(private readonly prisma: PrismaService) {}

  async getCharacters(): Promise<GetCharacter[]> {
    const characters = await this.prisma.character.findMany({
      include: { characterInfo: true },
    });

    return characters.map((character) => new GetCharacter(character));
  }

  async characterSelect(user: User, param: CharacterSelectParam) {
    const { characterId } = param;

    const existingCharacter = await this.prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!existingCharacter)
      throw new BadRequestException('존재하지 않는 캐릭터입니다.');

    return await Promise.all([
      this.prisma.myCharacter.create({
        data: {
          characterId,
          userId: user.id,
        },
        select: {
          character: true,
        },
      }),
      this.prisma.user.update({
        where: { id: user.id },
        data: { status: UserStatus.ACTIVE },
        select: {
          email: true,
          status: true,
        },
      }),
    ]);
  }
}
