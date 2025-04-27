import { InteractionType, Prisma } from '@prisma/client';

export const PROOF_WITH_PHOTO = Prisma.validator<Prisma.ProofDefaultArgs>()({
  include: {
    photoProof: true,
  },
});

export type ProofWithPhoto = Prisma.ProofGetPayload<typeof PROOF_WITH_PHOTO>;

export const PROOF_FOR_GET_PROOF = Prisma.validator<Prisma.ProofDefaultArgs>()({
  select: {
    id: true,
    view: true,
    createdAt: true,
    _count: {
      select: {
        photoComment: true,
        proofInteraction: {
          where: {
            type: InteractionType.LIKE,
          },
        },
      },
    },
    photoProof: {
      select: {
        url: true,
      },
    },
    groupProgress: {
      select: {
        join: {
          select: {
            group: {
              select: {
                id: true,
                title: true,
              },
            },
            user: {
              select: {
                id: true,
                nickname: true,
                profilePhoto: {
                  select: {
                    url: true,
                    createdAt: true,
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

export type ProofForGetProof = Prisma.ProofGetPayload<
  typeof PROOF_FOR_GET_PROOF
>;
