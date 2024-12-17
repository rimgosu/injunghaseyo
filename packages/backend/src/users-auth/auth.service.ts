import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { VerifyEmailParam } from './dtos/verify-email-param.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { VerifyCodeParams } from './dtos/verify-code-params.dto';
import { EmailService } from '@/email/email.service';
import { PrismaService } from '@/prisma/prisma.service';
import { SignUpParam } from './dtos/sign-up-params.dto';
import { SignInParams } from './dtos/sign-in-params.dto';
import { AuthHelper } from './auth.helper';
import { GeneratedJwt, OauthUser, TokenWithUser } from './utils/types';
import { ReissueAtkRes } from './dtos/reissue-atk-res.dto';
import { Provider, User, UserStatus } from '@prisma/client';
import { FindPasswordParam } from './dtos/find-password-param.dto';
import { ChgPasswordParams } from './dtos/chg-password-params.dto';
import { BASE_PROFILE_PHOTO_S3_URL } from '@/common/constants';
import { ActivateOauthParams } from './dtos/activate-oauth-params.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly emailService: EmailService,
    private readonly authHelper: AuthHelper,
    private readonly configService: ConfigService,
  ) {}

  async activateOauth(user: User, params: ActivateOauthParams) {
    const { eventAgree, nickname } = params;

    if (user.status !== UserStatus.OAUTH_PENDING)
      throw new BadRequestException('oauth 활성화가 필요한 유저가 아닙니다.');

    return await this.prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        nickname,
        eventAgree,
        status: UserStatus.ACTIVE,
      },
      select: {
        email: true,
        nickname: true,
        eventAgree: true,
        provider: true,
        status: true,
      },
    });
  }

  async oauthLogin(
    oauthUser: OauthUser,
    provider: Provider,
  ): Promise<TokenWithUser> {
    const { email, nickname, profile_image } = oauthUser;

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          nickname,
          eventAgree: false,
          ProfilePhoto: {
            create: { url: profile_image ?? BASE_PROFILE_PHOTO_S3_URL },
          },
          status: UserStatus.OAUTH_PENDING,
          provider,
        },
      });
    }

    const generatedJwt: GeneratedJwt = this.authHelper.generateJwt({
      uuid: user.uuid,
      role: user.role,
    });

    await this.prisma.user.update({
      where: { uuid: user.uuid },
      data: {
        lastLogin: new Date(),
        refreshToken: generatedJwt.refreshToken,
      },
    });

    return {
      email: user.email,
      generatedJwt,
    };
  }

  async withdraw(user: User) {
    return await this.prisma.user.update({
      data: {
        deletedAt: new Date(),
        status: UserStatus.WITHDRAWN,
        ProfilePhoto: {
          updateMany: {
            data: {
              deletedAt: new Date(),
            },
            where: {},
          },
        },
      },
      where: {
        id: user.id,
      },
      select: {
        deletedAt: true,
        status: true,
        email: true,
      },
    });
  }

  async changePassword(chgPasswordParams: ChgPasswordParams, user: User) {
    const { changePassword, password } = chgPasswordParams;

    const isPasswordMatch = await this.authHelper.verifyPassword(
      password,
      user.password,
      user.salt,
    );

    if (!isPasswordMatch)
      throw new UnauthorizedException('기존 패스워드 불일치');

    const { hashedPassword, salt } =
      await this.authHelper.hashPassword(changePassword);

    return this.prisma.user.update({
      data: {
        password: hashedPassword,
        salt,
        lastPwdChanged: new Date(),
      },
      where: {
        id: user.id,
      },
      select: {
        email: true,
        lastPwdChanged: true,
      },
    });
  }

  async findPassword(findPasswordParam: FindPasswordParam) {
    const { email } = findPasswordParam;

    const user = await this.prisma.user.findUnique({
      where: { email, deletedAt: null, status: UserStatus.ACTIVE },
    });

    if (!user?.password)
      throw new BadRequestException('user 또는 password 없음');

    const tempPassword = this.authHelper.generateStrongPassword();

    await this.cacheManager.set(
      `temp:password:${email}`,
      tempPassword,
      1000 * 60 * 5,
    );

    await this.emailService.sendVerificationEmail(
      email,
      tempPassword,
      'find-password',
      5,
    );

    return {
      message: `${email}로 정상적으로 임시 비밀번호 전송`,
    };
  }

  async reissueAtk(user: User): Promise<ReissueAtkRes> {
    const { role, uuid } = user;

    const { accessToken } = this.authHelper.generateJwt({ role, uuid });

    return new ReissueAtkRes(accessToken);
  }

  async signIn(params: SignInParams): Promise<TokenWithUser> {
    const { email, password } = params;

    const user = await this.prisma.user.findUnique({
      where: { email, deletedAt: null, status: UserStatus.ACTIVE },
    });

    if (!user) throw new UnauthorizedException('로그인 실패');

    if (user.provider) throw new BadRequestException('oauth 유저');

    const isTempPassword = await this.isTempPassword(params);

    if (!isTempPassword) {
      const passwordMatch = await this.authHelper.verifyPassword(
        password,
        user.password,
        user.salt,
      );

      if (!passwordMatch) {
        await this.passwordMismatch(email, user);
      }
    }

    const generatedJwt: GeneratedJwt = this.authHelper.generateJwt({
      uuid: user.uuid,
      role: user.role,
    });

    await this.prisma.user.update({
      where: { uuid: user.uuid },
      data: {
        lastLogin: new Date(),
        refreshToken: generatedJwt.refreshToken,
      },
    });

    return {
      email: user.email,
      generatedJwt,
    };
  }

  /**
   * @description password 10회 이상 틀리면 계정 비활성화
   */
  private async passwordMismatch(email: string, user: User) {
    const loginFailedUser = await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        loginFailCount: user.loginFailCount + 1,
      },
      select: {
        loginFailCount: true,
      },
    });

    if (loginFailedUser.loginFailCount > 10) {
      await this.prisma.user.update({
        where: {
          email,
        },
        data: {
          status: UserStatus.INACTIVE,
        },
      });

      throw new UnauthorizedException(
        `해당 이메일은 비활성화 되었습니다. 관리자에게 문의하세요. ${this.configService.get('email.user')}`,
      );
    }
    throw new UnauthorizedException('로그인 실패');
  }

  /**
   * @description 임시 비밀번호를 발급받은 사용자 로직
   */
  private async isTempPassword(params: SignInParams): Promise<boolean> {
    const { email, password } = params;
    const tempPassword = await this.cacheManager.get(`temp:password:${email}`);

    if (!tempPassword) return false;

    if (password !== tempPassword)
      throw new UnauthorizedException('임시 비밀번호가 틀렸습니다.');

    const { hashedPassword, salt } =
      await this.authHelper.hashPassword(tempPassword);

    await Promise.all([
      this.prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          salt,
          lastPwdChanged: new Date(),
        },
      }),
      this.cacheManager.del(`temp:password:${email}`),
    ]);

    return true;
  }

  async signUp(param: SignUpParam) {
    const { email, eventAgree, nickname, password } = param;

    const [userByEmail, userByNickname] = await Promise.all([
      this.prisma.user.findUnique({ where: { email } }),
      this.prisma.user.findUnique({ where: { nickname } }),
    ]);
    if (userByEmail) throw new ConflictException('이메일 중복');
    if (userByNickname) throw new ConflictException('닉네임 중복');

    const verified = await this.cacheManager.get(`verified:${email}`);
    if (!verified) throw new NotAcceptableException('인증코드 확인 필요');

    const { hashedPassword, salt } =
      await this.authHelper.hashPassword(password);

    return this.prisma.user.create({
      data: {
        email,
        eventAgree,
        nickname,
        password: hashedPassword,
        salt: salt,
        ProfilePhoto: { create: { url: BASE_PROFILE_PHOTO_S3_URL } },
      },
      select: {
        email: true,
        eventAgree: true,
        nickname: true,
      },
    });
  }

  async verifyCode(params: VerifyCodeParams) {
    const { email, code } = params;

    const cachedCode = await this.cacheManager.get(`code:${email}`);

    if (cachedCode !== code)
      throw new UnauthorizedException('잘못된 인증 코드');

    await this.cacheManager.set(`verified:${email}`, 1, 60 * 30 * 1000); // 30분 이내로 가입 마치면 된다.

    return { message: `${email}: verified` };
  }

  async verifyEmail(param: VerifyEmailParam) {
    const { email } = param;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) throw new ConflictException('이메일 중복');

    const authCode = this.authHelper.generateVerificationCode();

    await this.cacheManager.set(`code:${email}`, authCode);

    await this.emailService.sendVerificationEmail(
      email,
      authCode,
      'email-verify',
      3,
    );
  }
}
