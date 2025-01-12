import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import { User, UserStatus } from '@prisma/client';
import { JwtPaylaod } from '../utils/types';

@Injectable()
export class AtkOptionalStrategy extends PassportStrategy(
  Strategy,
  'atk-optional',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.accessSecret'),
    });
  }

  async validate(payload: JwtPaylaod): Promise<User | undefined> {
    if (!payload) return undefined;

    const user = await this.prisma.user.findUnique({
      where: {
        uuid: payload.uuid,
        deletedAt: null,
      },
    });

    if (!user) return undefined;

    if (
      user.status in
      [UserStatus.INACTIVE, UserStatus.BLOCKED, UserStatus.WITHDRAWN]
    )
      return undefined;

    return user;
  }
}
