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

export const MY_CHARACTER_CHARACTER_INFO = (totalExp: number) => {
  return Prisma.validator<Prisma.MyCharacterDefaultArgs>()({
    include: {
      character: {
        include: {
          characterInfo: {
            where: {
              OR: [
                {
                  AND: [
                    {
                      expNeed: {
                        lte: totalExp,
                      },
                    },
                    {
                      nextExpNeed: {
                        gt: totalExp,
                      },
                    },
                  ],
                },
                {
                  AND: [
                    {
                      expNeed: {
                        lte: totalExp,
                      },
                    },
                    {
                      nextExpNeed: null,
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    },
  });
};

export type MyCharacterCharacterInfo = Prisma.MyCharacterGetPayload<
  ReturnType<typeof MY_CHARACTER_CHARACTER_INFO>
>;
