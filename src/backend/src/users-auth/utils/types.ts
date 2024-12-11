import { Role } from '@prisma/client';

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
}
