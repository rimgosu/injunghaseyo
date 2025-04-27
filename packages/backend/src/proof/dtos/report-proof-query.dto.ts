import { ApiProperty } from '@nestjs/swagger';
import { ProofReportReason } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class ReportProofQuery {
  @ApiProperty({
    enum: ProofReportReason,
    description: '신고 이유',
    example: ProofReportReason.SPAM,
  })
  @IsEnum(ProofReportReason)
  reason: ProofReportReason;
}
