import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProofService } from './proof.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { GetProofsRes } from './dtos/get-proofs-res.dto';
import { BaseCursorPaginationQueryDto } from '@/common/base-cursor-pagination-query.dto';
import { GetProofRes } from './dtos/get-proof-res.dto';
import { GetClientIp } from '@/common/get-client-ip.decorator';
import { AtkGuard } from '@/auth/guards/atk.guard';
import { User } from '@prisma/client';
import { GetOptionalUser, GetUser } from '@/common/get-user.decorator';
import { InteractionProofQuery } from './dtos/core/interaction-proof-query.dto';
import { ReportProofQuery } from './dtos/report-proof-query.dto';
import { CreateCommentQuery } from './dtos/create-comment-query.dto';
import { CreateCommentBody } from './dtos/create-comment-body.dto';
import { GetCommentsResDto } from './dtos/core/get-comments-res.dto';
import { AtkOptionalGuard } from '@/auth/guards/atk-optional.guard';
import { GetRepliesResDto } from './dtos/get-replies-res.dto';
import { InteractionCommentQuery } from './dtos/interaction-comment-query.dto';
import { UpdateCommentBody } from './dtos/update-comment-body.dto';
import { GetProofQuery } from './dtos/get-proof-query.dto';

@Controller('proofs')
export class ProofController {
  constructor(private readonly proofService: ProofService) {}

  /**
   * @description 갤러리 조회
   */
  @Get()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: GetProofsRes,
    description: '갤러리 조회',
  })
  async getProofs(
    @Query() query: BaseCursorPaginationQueryDto,
  ): Promise<GetProofsRes> {
    return this.proofService.getProofs(query);
  }

  /**
   * @description 인증 조회
   *
   * - 갤러리 -> 사진 클릭
   * - 조회수 +1 (ip별로 24시간 쿨타임)
   */
  @Get(':proofId')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: GetProofRes,
    description: '인증 조회',
  })
  @UseGuards(AtkOptionalGuard)
  async getProof(
    @Param('proofId') proofId: number,
    @Query() query: GetProofQuery,
    @GetOptionalUser() user: User | undefined,
    @GetClientIp() ip: string,
  ): Promise<GetProofRes> {
    return this.proofService.getProof(proofId, ip, query, user);
  }

  /**
   * @description 인증 좋아요 / 싫어요
   *
   * 좋아요
   * - 아무것도 눌려있지 않은 상황: 좋아요 추가
   * - 좋아요가 눌려있는 상황: 좋아요 취소
   * - 싫어요가 눌려있는 상황: 좋아요로 변경
   *
   * 싫어요
   * - 아무것도 눌려있지 않은 상황: 싫어요 추가
   * - 싫어요가 눌려있는 상황: 싫어요 취소
   * - 좋아요가 눌려있는 상황: 싫어요로 변경
   */
  @Post(':proofId/interation')
  @UseGuards(AtkGuard)
  @ApiBearerAuth('jwt')
  async interactionProof(
    @Param('proofId') proofId: number,
    @GetUser() user: User,
    @Query() query: InteractionProofQuery,
  ) {
    return this.proofService.interactionProof(proofId, user, query);
  }

  /**
   * @description 인증 신고
   *
   * - 한 유저는 인증 하나 당 신고 하나만 할 수 있음.
   */
  @Post(':proofId/report')
  @UseGuards(AtkGuard)
  @ApiBearerAuth('jwt')
  async reportProof(
    @Param('proofId') proofId: number,
    @GetUser() user: User,
    @Query() query: ReportProofQuery,
  ) {
    return this.proofService.reportProof(proofId, user, query);
  }

  /**
   * @description 댓글 달기
   */
  @Post(':proofId/comments')
  @UseGuards(AtkGuard)
  @ApiBearerAuth('jwt')
  async createComment(
    @Param('proofId') proofId: number,
    @GetUser() user: User,
    @Body() body: CreateCommentBody,
    @Query() query: CreateCommentQuery,
  ) {
    return this.proofService.createComment(proofId, user, body, query);
  }

  /**
   * @description 댓글 조회
   */
  @Get(':proofId/comments')
  @HttpCode(200)
  @UseGuards(AtkOptionalGuard)
  @ApiResponse({
    status: 200,
    type: GetCommentsResDto,
    description: '댓글 조회',
  })
  async getComments(
    @GetOptionalUser() user: User | undefined,
    @Param('proofId') proofId: number,
    @Query() query: BaseCursorPaginationQueryDto,
  ): Promise<GetCommentsResDto> {
    return this.proofService.getComments(proofId, user, query);
  }

  /**
   * @description 댓글 수정
   */
  @Patch(':proofId/comments/:commentId')
  @UseGuards(AtkGuard)
  @ApiBearerAuth('jwt')
  async updateComment(
    @Param('proofId') proofId: number,
    @Param('commentId') commentId: number,
    @GetUser() user: User,
    @Body() body: UpdateCommentBody,
  ) {
    return this.proofService.updateComment({
      proofId,
      commentId,
      user,
      body,
    });
  }

  /**
   * @description 댓글 삭제
   */
  @Delete(':proofId/comments/:commentId')
  @UseGuards(AtkGuard)
  @ApiBearerAuth('jwt')
  async deleteComment(
    @Param('proofId') proofId: number,
    @Param('commentId') commentId: number,
    @GetUser() user: User,
  ) {
    return this.proofService.deleteComment({ proofId, commentId, user });
  }

  /**
   * @description 대댓글 조회
   */
  @Get(':proofId/comments/:commentId/replies')
  @HttpCode(200)
  @UseGuards(AtkOptionalGuard)
  @ApiResponse({
    status: 200,
    type: GetRepliesResDto,
    description: '대댓글 조회',
  })
  async getReplies(
    @GetOptionalUser() user: User | undefined,
    @Param('proofId') proofId: number,
    @Param('commentId') commentId: number,
    @Query() query: BaseCursorPaginationQueryDto,
  ) {
    return this.proofService.getReplies(proofId, commentId, user, query);
  }

  /**
   * @description 댓글 인터렉션
   *
   * - proof/interaction과 동일한 로직
   */
  @Post(':proofId/comments/:commentId/interaction')
  @UseGuards(AtkGuard)
  @ApiBearerAuth('jwt')
  async interactionComment(
    @Param('proofId') proofId: number,
    @Param('commentId') commentId: number,
    @GetUser() user: User,
    @Query() query: InteractionCommentQuery,
  ) {
    return this.proofService.interactionComment(
      proofId,
      commentId,
      user,
      query,
    );
  }
}
