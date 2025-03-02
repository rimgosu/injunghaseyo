import { JoinRole, ProofMethod, ProofType, User } from '@prisma/client';

export const yelloName = '노랑이';
export const greenName = '초록이';
export const blueName = '파랑이';

export interface UserWithJoinRole extends User {
  joinRole: JoinRole;
}

export interface ProofMethodSeedInput extends Partial<ProofMethod> {
  contents: string;
  type: ProofType;
  fromMin: number;
  toMin: number;
}
