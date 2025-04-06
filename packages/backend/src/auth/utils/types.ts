import { ICheckLevelUpReturnType } from '@/character/utils/types';
import { Prisma, Role } from '@prisma/client';

export interface JwtPaylaod {
  uuid: string;
  role: Role;
}

export interface GeneratedJwt {
  accessToken: string;
  refreshToken: string;
}

export interface TokenWithUser {
  email: string;
  generatedJwt: GeneratedJwt;
  checkLevelUpResult?: ICheckLevelUpReturnType | void;
}

export interface ExtractedJwt {
  uuid: string;
  role: Role;
  iat: number;
  exp: number;
}

export interface OauthUser {
  email: string;
  nickname: string;
  profile_image?: string;
}

export type CharacterWithInfo = Prisma.CharacterGetPayload<{
  include: { characterInfo: true };
}>;
