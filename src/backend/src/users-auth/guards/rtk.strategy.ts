import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ExtractedJwt, JwtPaylaod } from '../utils/types';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthHelper } from '../auth.helper';

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

  async validate(req: Request): Promise<ExtractedJwt> {
    const rtk = req?.cookies._SESSION;

    const payload = this.authHelper.extractPayload(rtk, 'refresh');

    return payload;
  }
}
