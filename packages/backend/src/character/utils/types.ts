import { Prisma } from '@prisma/client';

export type CharacterInfoSelect = Prisma.CharacterInfoGetPayload<{
  select: {
    level: true;
    expNeed: true;
  };
}>;

export interface ICheckLevelUpReturnType {
  levelUp: boolean;
  beforeLevel: number;
  afterLevel: number;
}

export const MY_CHARACTER_CHARACTER_INFO =
  Prisma.validator<Prisma.MyCharacterDefaultArgs>()({
    include: {
      character: {
        include: {
          characterInfo: true,
        },
      },
    },
  });

export type MyCharacterCharacterInfo = Prisma.MyCharacterGetPayload<
  typeof MY_CHARACTER_CHARACTER_INFO
>;
