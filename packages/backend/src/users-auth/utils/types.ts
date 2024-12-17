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

export interface ExtractedJwt {
  uuid: string;
  role: Role;
  iat: number;
  exp: number;
}

export interface KaKaoUser {
  nickname: string;
  profile_image?: string;
  email: string;
}

export interface GoogleUser {
  email: string;
  firstName: string;
  lastName?: string;
  picture: string;
}
