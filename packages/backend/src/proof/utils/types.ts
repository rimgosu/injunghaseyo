import { Prisma } from '@prisma/client';

export const PHOTO_WITH_PROOF =
  Prisma.validator<Prisma.PhotoProofDefaultArgs>()({
    include: {
      proof: true,
    },
  });

export type PhotoWithProof = Prisma.PhotoProofGetPayload<
  typeof PHOTO_WITH_PROOF
>;
