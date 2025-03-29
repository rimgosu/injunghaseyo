import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import { User, UserStatus } from '@prisma/client';
import { JwtPaylaod } from '../utils/types';
import { AuthHelper } from '../utils/auth.helper';

@Injectable()
export class AtkOptionalStrategy extends PassportStrategy(
  Strategy,
  'atk-optional',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly authHelper: AuthHelper,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.accessSecret'),
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: JwtPaylaod): Promise<User | undefined> {
    if (!payload) return undefined;

    const isBlacklisted = await this.authHelper.isTokenBlacklisted(
      req.headers.authorization.split(' ')[1],
    );

    if (isBlacklisted) return undefined;

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
