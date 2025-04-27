import { PrismaService } from '@/prisma/prisma.service';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GetProofsRes } from './dtos/get-proofs-res.dto';
import { PROOF_FOR_GET_PROOF, PROOF_WITH_PHOTO } from './utils/types';
import { BaseCursorPaginationQueryDto } from '@/common/base-cursor-pagination-query.dto';
import { GetProofRes } from './dtos/get-proof-res.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheKeyConstants } from '@/common/cache-key';
import { User } from '@prisma/client';
import { InteractionProofQuery } from './dtos/interaction-proof-query.dto';
import { ReportProofQuery } from './dtos/report-proof-query.dto';
import { CreateCommentBody } from './dtos/create-comment-body.dto';
import { CreateCommentQuery } from './dtos/create-comment-query.dto';

@Injectable()
export class ProofService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  private readonly logger = new Logger(ProofService.name, { timestamp: true });

  private async checkProof(proofId: number) {
    const proof = await this.prisma.proof.findUnique({
      where: {
        id: proofId,
        deletedAt: null,
      },
    });

    if (!proof) {
      this.logger.error(`인증을 찾을 수 없습니다. proofId: ${proofId}`);
      throw new NotFoundException('인증을 찾을 수 없습니다.');
    }

    return proof;
  }

  async createComment(
    proofId: number,
    user: User,
    body: CreateCommentBody,
    query: CreateCommentQuery,
  ) {
    const { parentCommentId } = query;
    const { contents } = body;
    let depth = 1;

    await this.checkProof(proofId);

    // 대댓글 처리
    if (parentCommentId) {
      const parentComment = await this.prisma.proofComment.findUnique({
        where: {
          id: parentCommentId,
          proofId,
          deletedAt: null,
        },
      });

      if (!parentComment) {
        throw new NotFoundException('대댓글의 부모 댓글이 존재하지 않습니다.');
      }

      depth = parentComment.depth + 1;
    }

    return await this.prisma.proofComment.create({
      data: {
        proofId,
        userId: user.id,
        contents,
        depth,
        ...(parentCommentId && { parentId: parentCommentId }),
      },
    });
  }

  async reportProof(proofId: number, user: User, query: ReportProofQuery) {
    const { reason } = query;

    await this.checkProof(proofId);

    return await this.prisma.proofReport.upsert({
      where: {
        proofId_userId: {
          proofId,
          userId: user.id,
        },
      },
      update: {
        reason,
      },
      create: {
        proofId,
        userId: user.id,
        reason,
      },
    });
  }

  async interactionProof(
    proofId: number,
    user: User,
    query: InteractionProofQuery,
  ) {
    const { type } = query;

    await this.checkProof(proofId);

    const proofInteraction = await this.prisma.proofInteraction.findUnique({
      where: {
        proofId_userId: {
          proofId,
          userId: user.id,
        },
      },
    });

    // 아무 인터렉션도 없다면 그대로 추가
    if (!proofInteraction) {
      return await this.prisma.proofInteraction.create({
        data: {
          proofId,
          userId: user.id,
          type,
        },
      });
    }

    // 반대 인터렉션이 있다면 업데이트
    if (proofInteraction.type !== type) {
      return await this.prisma.proofInteraction.update({
        where: {
          proofId_userId: {
            proofId,
            userId: user.id,
          },
        },
        data: {
          type,
        },
      });
    }

    // 같은 인터렉션이 있다면 삭제
    return await this.prisma.proofInteraction.delete({
      where: {
        proofId_userId: {
          proofId,
          userId: user.id,
        },
      },
    });
  }

  async getProof(proofId: number, ip: string): Promise<GetProofRes> {
    const cacheKey = CacheKeyConstants.PROOF_VIEW(proofId, ip);
    const cachedView = await this.cacheManager.get(cacheKey);

    const proof = await this.prisma.proof.findUnique({
      where: { id: proofId, deletedAt: null, photoProof: { deletedAt: null } },
      ...PROOF_FOR_GET_PROOF,
    });

    if (!proof) {
      throw new NotFoundException('존재하지 않는 인증입니다.');
    }

    /**
     * ip별로 조회수 증가 로직
     */
    if (!cachedView) {
      await Promise.all([
        this.cacheManager.set(cacheKey, 1, 60 * 60 * 24 * 1000),
        this.prisma.proof.update({
          where: {
            id: proofId,
            deletedAt: null,
            photoProof: { deletedAt: null },
          },
          data: { view: { increment: 1 } },
        }),
      ]);
      proof.view += 1;
    }

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
