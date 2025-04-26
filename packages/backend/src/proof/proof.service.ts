import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { GetProofsRes } from './dtos/get-proofs-res.dto';
import { PROOF_FOR_GET_PROOF, PROOF_WITH_PHOTO } from './utils/types';
import { BaseCursorPaginationQueryDto } from '@/common/base-cursor-pagination-query.dto';
import { GetProofRes } from './dtos/get-proof-res.dto';

@Injectable()
export class ProofService {
  constructor(private readonly prisma: PrismaService) {}

  async getProof(proofId: number): Promise<GetProofRes> {
    const proof = await this.prisma.proof.findUnique({
      where: { id: proofId, deletedAt: null, photoProof: { deletedAt: null } },
      ...PROOF_FOR_GET_PROOF,
    });

    return new GetProofRes(proof);
  }

  async getProofs(query: BaseCursorPaginationQueryDto): Promise<GetProofsRes> {
    const { take, cursor } = query;
    const proofs = await this.prisma.proof.findMany({
      where: {
        deletedAt: null,
        photoProof: {
          deletedAt: null,
        },
      },
      ...PROOF_WITH_PHOTO,
      orderBy: {
        createdAt: 'desc',
      },
      take: take ? take + 1 : undefined,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const hasNextPage = proofs.length > take;
    const items = hasNextPage ? proofs.slice(0, -1) : proofs;
    const nextCursor = hasNextPage ? proofs[proofs.length - 1].id : undefined;

    return new GetProofsRes(items, hasNextPage, nextCursor);
  }
}
