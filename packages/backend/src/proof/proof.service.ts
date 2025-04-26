import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { GetProofRes } from './dtos/get-proof-res.dto';
import { PHOTO_WITH_PROOF } from './utils/types';

@Injectable()
export class ProofService {
  constructor(private readonly prisma: PrismaService) {}

  async getProofs(): Promise<GetProofRes[]> {
    const proofs = await this.prisma.photoProof.findMany({
      where: {
        deletedAt: null,
      },
      ...PHOTO_WITH_PROOF,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return proofs.map((proof) => new GetProofRes(proof));
  }
}
