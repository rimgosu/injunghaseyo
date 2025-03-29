import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { ExtractedJwt, GeneratedJwt, JwtPaylaod } from './types';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheKeyConstants } from '@/common/cache-key';

@Injectable()
export class AuthHelper {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  private readonly SALT_LENGTH = 16;
  private readonly ITERATIONS = 100000;
  private readonly KEY_LENGTH = 64;
  private readonly DIGEST = 'sha512';

  /**
   * @description 토큰 블랙리스트 확인
   */
  async isTokenBlacklisted(atk: string): Promise<boolean> {
    return await this.cacheManager.get<boolean>(
      CacheKeyConstants.BLACKLIST_ATK(atk),
    );
  }

  /**
   * @description 강력한 임시 비밀번호를 생성한다. (10자리)
   * - 대문자, 소문자, 숫자, 특수문자를 모두 포함
   * - crypto.randomBytes를 사용하여 안전한 난수 생성
   */
  generateStrongPassword(length: number = 10): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    const allChars = lowercase + uppercase + numbers + symbols;

    // 각 문자 유형이 최소 1개씩 포함되도록 보장
    let password =
      this.getRandomChar(uppercase) +
      this.getRandomChar(lowercase) +
      this.getRandomChar(numbers) +
      this.getRandomChar(symbols);

    // 나머지 자리 채우기
    while (password.length < length) {
      const randomBytes = crypto.randomBytes(1);
      const randomChar = allChars[randomBytes[0] % allChars.length];
      password += randomChar;
    }

    // 문자열을 무작위로 섞기
    return this.shuffleString(password);
  }

  /**
   * @description 주어진 문자열에서 무작위 문자 하나를 선택한다.
   */
  private getRandomChar(characters: string): string {
    const randomBytes = crypto.randomBytes(1);
    return characters[randomBytes[0] % characters.length];
  }

  /**
   * @description Fisher-Yates 알고리즘을 사용하여 문자열을 무작위로 섞는다.
   */
  private shuffleString(str: string): string {
    const array = str.split('');
    for (let i = array.length - 1; i > 0; i--) {
      const randomBytes = crypto.randomBytes(1);
      const j = randomBytes[0] % (i + 1);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
  }

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
