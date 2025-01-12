import { Prisma } from '@prisma/client';

export const GROUP_WITH_INCLUDE = Prisma.validator<Prisma.GroupDefaultArgs>()({
  include: {
    groupTagMap: {
      include: {
        tag: true,
      },
    },
    join: {
      include: {
        user: true,
      },
    },
    groupDate: true,
  },
});

export type GroupWith = Prisma.GroupGetPayload<typeof GROUP_WITH_INCLUDE>;

export interface DateInterface {
  date: string;
}
