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
import { AuthHelper } from '../auth.helper';
import { User } from '@prisma/client';
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
    private readonly authHelper: AuthHelper,
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
    console.log('payload:', paylaod);

    const user = this.prisma.user.findUnique({
      where: { uuid: paylaod.uuid },
    });

    if (!user) throw new UnauthorizedException('유저를 찾을 수 없음');

    return user;
  }
}
