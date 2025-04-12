import { JoinRole, Prisma, ProofMethod, ProofType, User } from '@prisma/client';

export const bearName = '곰';
export const yelloName = '노랑이';
export const rabbitName = '토끼';

export interface UserWithJoinRole extends User {
  joinRole: JoinRole;
}

export interface ProofMethodSeedInput extends Partial<ProofMethod> {
  contents: string;
  type: ProofType;
  fromMin: number;
  toMin: number;
}

export const GROUP_WITH_GROUP_DATE =
  Prisma.validator<Prisma.GroupDefaultArgs>()({
    include: {
      groupDate: true,
    },
  });

export type GroupWithGroupDate = Prisma.GroupGetPayload<
  typeof GROUP_WITH_GROUP_DATE
>;
