import { ApiProperty, PickType } from '@nestjs/swagger';
import { BaseGroupRes } from './base-res.dto';
import { GroupWithToday } from '../utils/types';
import { GroupProgressStatus } from '@prisma/client';

class Proof extends PickType(BaseGroupRes, ['proofMethod', 'proofPhoto']) {
  constructor(proofMethod: string, proofPhoto: string | undefined) {
    super();
    this.proofMethod = proofMethod;
    this.proofPhoto = proofPhoto ?? null;
  }
}

export class GetTodayRes extends PickType(BaseGroupRes, [
  'title',
  'description',
  'groupDate',
  'completedDate',
]) {
  @ApiProperty({
    description: '인증 정보',
    type: [Proof],
  })
  proofs: Proof[];

  constructor(group: GroupWithToday) {
    super();

    this.proofs = group.proofMethod.map((method) => {
      const proofPhoto = method.groupProgress[0]?.proofPhoto;
      return new Proof(method.method, proofPhoto?.url);
    });
    this.title = group.title;
    this.description = group.description;
    this.groupDate = group.groupDate.map((date) => date.date);
    this.completedDate = group.groupDate
      .filter((date) => {
        date.groupProgress.every(
          (progress) => progress.status === GroupProgressStatus.COMPLETED,
        );
      })
      .map((date) => date.date);
  }
}
