import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import axios from 'axios';
import { Strategy } from 'passport-kakao';
import { KaKaoUser } from '../utils/types';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('kakao.clientId'),
      clientSecret: '',
      callbackURL: configService.get('kakao.callback'),
    });
  }

  async validate(accessToken: string): Promise<KaKaoUser> {
    const user = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { nickname, profile_image } = user.data.properties;
    const { email } = user.data.kakao_account;

    return {
      nickname,
      profile_image,
      email,
    };
  }
}
