import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import { ProofService } from './proof.service';
import { ApiResponse } from '@nestjs/swagger';
import { GetProofsRes } from './dtos/get-proofs-res.dto';
import { BaseCursorPaginationQueryDto } from '@/common/base-cursor-pagination-query.dto';
import { GetProofRes } from './dtos/get-proof-res.dto';

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
   */
  @Get(':proofId')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: GetProofRes,
    description: '인증 조회',
  })
  async getProof(@Param('proofId') proofId: number): Promise<GetProofRes> {
    return this.proofService.getProof(proofId);
  }
}
