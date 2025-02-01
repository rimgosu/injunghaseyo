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
        user: {
          include: {
            profilePhoto: true,
          },
        },
      },
    },
    groupDate: true,
    proofMethod: true,
  },
});

export type GroupWith = Prisma.GroupGetPayload<typeof GROUP_WITH_INCLUDE>;

export interface DateInterface {
  date: string;
}

export const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
export const NINE_HOURS_IN_MS = 1000 * 60 * 60 * 9;

export const GROUP_WITH_TODAY = Prisma.validator<Prisma.GroupDefaultArgs>()({
  include: {
    groupDate: {
      include: {
        groupProgress: true,
      },
    },
    proofMethod: {
      include: {
        groupProgress: {
          include: {
            proofPhoto: true,
          },
        },
      },
    },
    join: true,
  },
});

export type GroupWithToday = Prisma.GroupGetPayload<typeof GROUP_WITH_TODAY>;

export type GroupWithProofDate = Prisma.GroupGetPayload<{
  include: {
    proofMethod: true;
    groupDate: true;
  };
}>;
