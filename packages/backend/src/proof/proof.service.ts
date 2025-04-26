import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { GetProofRes } from './dtos/get-proof-res.dto';
import { PROOF_WITH_PHOTO } from './utils/types';
import { BaseCursorPaginationQueryDto } from '@/common/base-cursor-pagination-query.dto';

@Injectable()
export class ProofService {
  constructor(private readonly prisma: PrismaService) {}

  async getProofs(query: BaseCursorPaginationQueryDto): Promise<GetProofRes> {
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

    return new GetProofRes(items, hasNextPage, nextCursor);
  }
}
