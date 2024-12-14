import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import { User } from '@prisma/client';
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

  async validate(req, payload: JwtPaylaod): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { uuid: payload.uuid },
    });

    if (!user) throw new UnauthorizedException('해당 유저가 없습니다.');

    return user;
  }
}
