import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPaylaod } from '../utils/types';
import { ConfigService } from '@nestjs/config';
import { User, UserStatus } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

/**
 * 해당 전략은 쿠키(httpOnly)에 저장되어 있는 rtk(리프레시 토큰)를 검증.
 * 기존의 방식과 다르게 토큰을 가져와야 하므로, 추출방법을 커스텀.
 */
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'rtk') {
  private logger = new Logger(RefreshTokenStrategy.name, { timestamp: true });

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      passReqToCallback: true,
      secretOrKey: configService.get('jwt.refreshSecret'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          const rtk = req?.cookies?._SESSION;
          if (!rtk) {
            this.logger.debug(`there is no _SESSION(rtk) in the cookie`);
            throw new BadRequestException(`there is no _SESSION in the cookie`);
          }

          return rtk;
        },
      ]),
    });
  }

  async validate(req, paylaod: JwtPaylaod): Promise<User> {
    const rtk = req?.cookies?._SESSION;

    const user = await this.prisma.user.findUnique({
      where: { uuid: paylaod.uuid },
    });

    if (rtk !== user?.refreshToken)
      throw new UnauthorizedException('rtk 불일치');

    if (user.status !== UserStatus.ACTIVE)
      throw new UnauthorizedException('활동 중인 유저가 아닙니다.');

    return user;
  }
}
