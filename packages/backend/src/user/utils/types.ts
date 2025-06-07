import { Prisma } from '@prisma/client';

export const USER_FOR_PROFILE = (userId: number) => {
  return Prisma.validator<Prisma.UserDefaultArgs>()({
    include: {
      wallet: true,
      profilePhoto: true,
      join: {
        where: {
          deletedAt: null,
        },
        include: {
          group: {
            include: {
              groupDate: {
                include: {
                  groupProgress: {
                    where: {
                      join: {
                        userId,
                        deletedAt: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
};

export type UserForProfile = Prisma.UserGetPayload<
  ReturnType<typeof USER_FOR_PROFILE>
>;

export type GroupWithProgress = Prisma.GroupGetPayload<{
  include: {
    groupDate: {
      include: {
        groupProgress: true;
      };
    };
  };
}>;
