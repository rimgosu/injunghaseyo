import {
  Controller,
  Get,
  HttpCode,
  Param,
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
import { GetUser } from '@/common/get-user.decorator';
import { InteractionProofQuery } from './dtos/interaction-proof-query.dto';

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
  async getProof(
    @Param('proofId') proofId: number,
    @GetClientIp() ip: string,
  ): Promise<GetProofRes> {
    return this.proofService.getProof(proofId, ip);
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
}
