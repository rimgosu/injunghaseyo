import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { ExtractedJwt, GeneratedJwt, JwtPaylaod } from './utils/types';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthHelper {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly SALT_LENGTH = 16;
  private readonly ITERATIONS = 100000;
  private readonly KEY_LENGTH = 64;
  private readonly DIGEST = 'sha512';

  generateVerificationCode(): string {
    const code = Math.floor(Math.random() * 1000000);
    return code.toString().padStart(6, '0');
  }

  async hashPassword(password: string): Promise<{
    hashedPassword: string;
    salt: string;
  }> {
    if (!password) {
      throw new BadRequestException('비밀번호는 공백을 허용하지 않습니다.');
    }
    const salt = crypto.randomBytes(this.SALT_LENGTH);

    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        password,
        salt,
        this.ITERATIONS,
        this.KEY_LENGTH,
        this.DIGEST,
        (err, derivedKey) => {
          if (err) reject(err);
          resolve({
            hashedPassword: derivedKey.toString('hex'),
            salt: salt.toString('hex'),
          });
        },
      );
    });
  }

  async verifyPassword(
    password: string,
    hashedPassword: string,
    salt: string,
  ): Promise<boolean> {
    const saltBuffer = Buffer.from(salt, 'hex');

    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        password,
        saltBuffer,
        this.ITERATIONS,
        this.KEY_LENGTH,
        this.DIGEST,
        (err, derivedKey) => {
          if (err) reject(err);
          resolve(derivedKey.toString('hex') === hashedPassword);
        },
      );
    });
  }

  generateJwt(jwtPayload: JwtPaylaod): GeneratedJwt {
    const accessToken = this.jwtService.sign(jwtPayload, {
      secret: this.configService.get<string>('jwt.accessSecret'),
      expiresIn: '1d',
    });
    const refreshToken = this.jwtService.sign(jwtPayload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: '30d',
    });
    return { accessToken, refreshToken };
  }

  /**
   * @description JWT 토큰으로부터 페이로드를 추출한다.
   */
  extractPayload(token: string, tokenType: 'access' | 'refresh'): ExtractedJwt {
    try {
      const secret = this.configService.get<string>(
        tokenType === 'access' ? 'jwt.accessSecret' : 'jwt.refreshSecret',
      );
      const payload = this.jwtService.verify(token, { secret });

      return payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
