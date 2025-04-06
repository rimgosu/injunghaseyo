import { Prisma } from '@prisma/client';

export type CharacterInfoSelect = Prisma.CharacterInfoGetPayload<{
  select: {
    level: true;
    expNeed: true;
  };
}>;

export type ICheckLevelUpReturnType = {
  levelUp: boolean;
  beforeLevel: number;
  afterLevel: number;
};
