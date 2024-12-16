import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import { User, UserStatus } from '@prisma/client';
import { JwtPaylaod } from '../utils/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
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

  async validate(payload: JwtPaylaod): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { uuid: payload.uuid, deletedAt: null, status: UserStatus.ACTIVE },
    });

    if (!user) throw new UnauthorizedException('해당 유저가 없습니다.');
    if (user.status !== UserStatus.ACTIVE)
      throw new UnauthorizedException('활동 중인 유저가 아닙니다.');

    return user;
  }
}
