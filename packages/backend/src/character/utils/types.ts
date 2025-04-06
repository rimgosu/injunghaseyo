import { Prisma } from '@prisma/client';

export type CharacterInfoSelect = Prisma.CharacterInfoGetPayload<{
  select: {
    level: true;
    expNeed: true;
  };
}>;
