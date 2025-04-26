import { Prisma } from '@prisma/client';

export const PROOF_WITH_PHOTO = Prisma.validator<Prisma.ProofDefaultArgs>()({
  include: {
    photoProof: true,
  },
});

export type ProofWithPhoto = Prisma.ProofGetPayload<typeof PROOF_WITH_PHOTO>;
