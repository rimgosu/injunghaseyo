import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import { User, UserStatus } from '@prisma/client';
import { JwtPaylaod } from '../utils/types';
import { AuthHelper } from '../utils/auth.helper';

@Injectable()
export class CharacterSelectStrategy extends PassportStrategy(
  Strategy,
  'character-select',
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

  async validate(req: any, payload: JwtPaylaod): Promise<User> {
    const isBlacklisted = await this.authHelper.isTokenBlacklisted(
      req.headers.authorization.split(' ')[1],
    );

    if (isBlacklisted)
      throw new UnauthorizedException('유저가 로그인하지 않았습니다.');

    const user = await this.prisma.user.findUnique({
      where: {
        uuid: payload.uuid,
        deletedAt: null,
      },
    });

    if (user?.status !== UserStatus.CHARACTER_CHOOSE)
      throw new UnauthorizedException('캐릭터를 선택할 단계가 아닙니다.');

    return user;
  }
}
