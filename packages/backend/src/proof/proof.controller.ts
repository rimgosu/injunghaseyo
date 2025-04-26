import { Controller, Get, HttpCode } from '@nestjs/common';
import { ProofService } from './proof.service';
import { ApiResponse } from '@nestjs/swagger';
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
    type: [GetProofRes],
    description: '갤러리 조회',
  })
  async getProofs(): Promise<GetProofRes[]> {
    return this.proofService.getProofs();
  }
}
