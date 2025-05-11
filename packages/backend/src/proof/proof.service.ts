import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { GetProofsRes } from './dtos/get-proofs-res.dto';
import {
  PROOF_COMMENT_WITH_INTERACTION,
  PROOF_FOR_GET_PROOF,
  PROOF_WITH_PHOTO,
} from './utils/types';
import { BaseCursorPaginationQueryDto } from '@/common/base-cursor-pagination-query.dto';
import { GetProofRes } from './dtos/get-proof-res.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheKeyConstants } from '@/common/cache-key';
import { User } from '@prisma/client';
import { InteractionProofQuery } from './dtos/core/interaction-proof-query.dto';
import { ReportProofQuery } from './dtos/report-proof-query.dto';
import { CreateCommentBody } from './dtos/create-comment-body.dto';
import { CreateCommentQuery } from './dtos/create-comment-query.dto';
import { GetCommentsResDto } from './dtos/core/get-comments-res.dto';
import { GetRepliesResDto } from './dtos/get-replies-res.dto';
import { InteractionCommentQuery } from './dtos/interaction-comment-query.dto';
import { UpdateCommentBody } from './dtos/update-comment-body.dto';
import { GetProofQuery } from './dtos/get-proof-query.dto';
import { CreateCommentResDto } from './dtos/create-comment-res.dto';

@Injectable()
export class ProofService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  private readonly logger = new Logger(ProofService.name, { timestamp: true });

  async deleteComment({
    proofId,
    commentId,
    user,
  }: {
    proofId: number;
    commentId: number;
    user: User;
  }) {
    await this.checkMyComment({ proofId, commentId, user });

    return await this.prisma.proofComment.update({
      where: { id: commentId },
      data: { deletedAt: new Date() },
    });
  }
  async updateComment({
    proofId,
    commentId,
    user,
    body,
  }: {
    proofId: number;
    commentId: number;
    user: User;
    body: UpdateCommentBody;
  }) {
    const { contents } = body;

    await this.checkMyComment({ proofId, commentId, user });

    return await this.prisma.proofComment.update({
      where: { id: commentId },
      data: { contents },
    });
  }

  private async checkMyComment({
    proofId,
    commentId,
    user,
  }: {
    proofId: number;
    commentId: number;
    user: User;
  }) {
    const comment = await this.prisma.proofComment.findUnique({
      where: { id: commentId, proofId, deletedAt: null },
    });

    if (!comment) {
      throw new NotFoundException('존재하지 않는 댓글입니다.');
    }

    if (comment.userId !== user.id) {
      throw new BadRequestException('본인의 댓글만 수정, 삭제할 수 있습니다.');
    }
  }

  /**
   * @description 댓글 인터렉션
   * @see interactionProof
   */
  async interactionComment(
    proofId: number,
    commentId: number,
    user: User,
    query: InteractionCommentQuery,
  ) {
    const { type } = query;

    await this.checkComment(proofId, commentId);

    const commentInteraction = await this.prisma.commentInteraction.findUnique({
      where: {
        proofCommentId_userId: {
          proofCommentId: commentId,
          userId: user.id,
        },
      },
    });

    if (!commentInteraction) {
      return await this.prisma.commentInteraction.create({
        data: { proofCommentId: commentId, userId: user.id, type },
      });
    }

    if (commentInteraction.type !== type) {
      return await this.prisma.commentInteraction.update({
        where: { id: commentInteraction.id },
        data: { type },
      });
    }

    return await this.prisma.commentInteraction.delete({
      where: { id: commentInteraction.id },
    });
  }

  private async checkComment(proofId: number, commentId: number) {
    const comment = await this.prisma.proofComment.findUnique({
      where: { id: commentId, proofId, deletedAt: null },
    });

    if (!comment) {
      throw new NotFoundException('존재하지 않는 댓글입니다.');
    }
  }

  async getReplies(
    proofId: number,
    commentId: number,
    user: User | undefined,
    query: BaseCursorPaginationQueryDto,
  ) {
    const { take, cursor } = query;
    const replies = await this.prisma.proofComment.findMany({
      where: { proofId, deletedAt: null, parentId: commentId },
      orderBy: { createdAt: 'asc' },
      take: take ? take + 1 : undefined,
      cursor: cursor ? { id: cursor } : undefined,
      ...PROOF_COMMENT_WITH_INTERACTION(user?.id, false),
    });

    const hasNextPage = replies.length > take;
    const items = hasNextPage ? replies.slice(0, -1) : replies;
    const nextCursor = hasNextPage ? replies[replies.length - 1].id : undefined;

    return new GetRepliesResDto(items, hasNextPage, nextCursor, user);
  }

  async getComments(
    proofId: number,
    query: BaseCursorPaginationQueryDto,
    user?: User,
  ) {
    const { take, cursor } = query;
    const comments = await this.prisma.proofComment.findMany({
      where: { proofId, deletedAt: null, parentId: null },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      ...PROOF_COMMENT_WITH_INTERACTION(user?.id, true),
      take: take ? take + 1 : undefined,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const hasNextPage = comments.length > take;
    const items = hasNextPage ? comments.slice(0, -1) : comments;
    const nextCursor = hasNextPage
      ? comments[comments.length - 1].id
      : undefined;

    return new GetCommentsResDto(items, hasNextPage, nextCursor, user);
  }

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

  private async checkParentComment({
    parentCommentId,
    proofId,
  }: {
    parentCommentId?: number;
    proofId: number;
  }) {
    if (!parentCommentId) {
      return; // 대댓글이 아니라면 처리 없이 종료
    }

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

    if (parentComment.parentId) {
      throw new BadRequestException('대댓글의 대댓글은 달 수 없습니다.');
    }
  }

  async createComment(
    proofId: number,
    user: User,
    body: CreateCommentBody,
    query: CreateCommentQuery,
  ) {
    const { parentCommentId } = query;
    const { contents } = body;

    await Promise.all([
      this.checkProof(proofId),
      this.checkParentComment({ parentCommentId, proofId }),
    ]);

    const [proofComment, userWithPhoto] = await Promise.all([
      this.prisma.proofComment.create({
        data: {
          proofId,
          userId: user.id,
          contents,
          ...(parentCommentId && { parentId: parentCommentId }),
        },
      }),
      this.prisma.user.findUnique({
        where: { id: user.id },
        include: {
          profilePhoto: true,
        },
      }),
    ]);

    return new CreateCommentResDto(proofComment, userWithPhoto);
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

  /**
   * @description 인증 인터렉션
   * @see interactionComment
   */
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
        where: { id: proofInteraction.id },
        data: {
          type,
        },
      });
    }

    // 같은 인터렉션이 있다면 삭제
    return await this.prisma.proofInteraction.delete({
      where: { id: proofInteraction.id },
    });
  }

  async getProof(
    proofId: number,
    ip: string,
    query: GetProofQuery,
    user?: User,
  ): Promise<GetProofRes> {
    const { groupId } = query;
    const cacheKey = CacheKeyConstants.PROOF_VIEW(proofId, ip);
    const cachedView = await this.cacheManager.get(cacheKey);

    const [proof, prev, next] = await Promise.all([
      this.prisma.proof.findUnique({
        where: {
          id: proofId,
          deletedAt: null,
          photoProof: { deletedAt: null },
          ...(groupId && { groupProgress: { join: { groupId } } }),
        },
        ...PROOF_FOR_GET_PROOF(user?.id),
      }),
      this.prisma.proof.findFirst({
        where: {
          deletedAt: null,
          photoProof: { deletedAt: null },
          ...(groupId && { groupProgress: { join: { groupId } } }),
          id: {
            lt: proofId,
          },
        },
        orderBy: {
          id: 'desc',
        },
        select: {
          id: true,
        },
      }),
      this.prisma.proof.findFirst({
        where: {
          deletedAt: null,
          photoProof: { deletedAt: null },
          ...(groupId && { groupProgress: { join: { groupId } } }),
          id: {
            gt: proofId,
          },
        },
        orderBy: {
          id: 'asc',
        },
        select: {
          id: true,
        },
      }),
    ]);

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

    return new GetProofRes({ proof, next, prev });
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
