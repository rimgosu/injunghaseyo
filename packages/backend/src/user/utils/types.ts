import { Prisma } from '@prisma/client';

export const USER_WITH_JOIN = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    wallet: true,
    profilePhoto: true,
    join: {
      include: {
        group: {
          include: {
            groupDate: {
              include: {
                groupProgress: true,
              },
            },
          },
        },
      },
    },
  },
});

export type UserWithJoin = Prisma.UserGetPayload<typeof USER_WITH_JOIN>;

export type GroupWithProgress = Prisma.GroupGetPayload<{
  include: {
    groupDate: {
      include: {
        groupProgress: true;
      };
    };
  };
}>;
