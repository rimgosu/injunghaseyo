import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

/**
 * @description 캐릭터 관련 서비스
 *
 * 3만원 짜리 모임 기준으로, 꾸준히 한 사람이면 레벨3 직전까지 가면 좋겠음.
 *
 * * 필요 경험치 양
 * 레벨1: 0
 * 레벨2: 100
 * 레벨3: 225
 * 레벨4: 375
 * 레벨5: 575
 *
 * * 레벨을 올릴 수 있는 방법
 * - 출석 체크 보상: +1exp
 * - 인증 보상: 3만원 기준, 총 +136exp (+46/1만원)
 * - 모임 종료 보상: 3만원 기준, 총 +34exp (+12/1만원)
 */
@Injectable()
export class CharacterService {
  private readonly ATTENDANCE_CHECK_REWARD_EXP = 1;
  private readonly PROOF_REWARD_EXP_PER_10000WON = 46;
  private readonly END_REWARD_EXP_PER_10000WON = 12;

  constructor(private readonly prisma: PrismaService) {}
}
