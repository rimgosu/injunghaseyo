import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { NaverUser } from '../utils/types';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('naver.clientId'),
      clientSecret: configService.get('naver.clientSecret'),
      callbackURL: configService.get('naver.callback'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    try {
      const { email, nickname, profile_image } = profile._json;

      const user: NaverUser = {
        email,
        nickname,
        profile_image,
        accessToken,
        refreshToken,
        provider: 'naver',
      };

      done(null, user);
      return user;
    } catch (error) {
      done(error, false);
    }
  }
}
