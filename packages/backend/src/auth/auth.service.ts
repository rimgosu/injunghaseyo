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
import { AuthHelper } from './utils/auth.helper';
import { GeneratedJwt, OauthUser, TokenWithUser } from './utils/types';
import { ReissueAtkRes } from './dtos/reissue-atk-res.dto';
import { Provider, Role, User, UserStatus } from '@prisma/client';
import { FindPasswordParam } from './dtos/find-password-param.dto';
import { ChgPasswordParams } from './dtos/chg-password-params.dto';
import { BASE_PROFILE_PHOTO_S3_URL } from '@/common/constants';
import { ActivateOauthParams } from './dtos/activate-oauth-params.dto';
import { ConfigService } from '@nestjs/config';
import { VerifyNicknameParam } from './dtos/verify-nickname-params.dto';
import { VerifyPasswordParams } from './dtos/verify-password.dto';
import { verifyPassword } from './utils/auth.util';
import { GetCheckSignIn } from './dtos/get-check-sign-in.dto';
import { CacheKeyConstants } from '@/common/cache-key';
import { CharacterRewardService } from '@/character/character-reward.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly emailService: EmailService,
    private readonly authHelper: AuthHelper,
    private readonly configService: ConfigService,
    private readonly characterRewardService: CharacterRewardService,
  ) {}

  async signOut(user: User, accessToken: string): Promise<void> {
    await Promise.all([
      this.prisma.user.update({
        where: { id: user.id },
        data: {
          refreshToken: null,
        },
      }),
      this.cacheManager.set(
        CacheKeyConstants.BLACKLIST_ATK(accessToken),
        true,
        1000 * 60 * 60 * 24 * 1, // 1d
      ),
    ]);
  }

  async checkSignIn(user: User): Promise<GetCheckSignIn> {
    const checkLevelUpResult = await this.characterRewardService.rewardSignIn(
      user.id,
    );

    return new GetCheckSignIn(user, checkLevelUpResult);
  }

  async verifyPassword(params: VerifyPasswordParams) {
    const { password } = params;

    const isPasswordValid = verifyPassword(password);

    if (!isPasswordValid)
      throw new BadRequestException(
        '비밀번호는 특수문자, 영문, 숫자를 포함한 8자리 이상의 글자여야합니다.',
      );

    return { message: '올바른 비밀번호' };
  }

  async verifyNickname(param: VerifyNicknameParam) {
    const { nickname } = param;

    const existingNickname = await this.prisma.user.findUnique({
      where: { nickname },
    });

    if (existingNickname) throw new BadRequestException('닉네임 중복');

    return { message: '가능한 닉네임입니다.' };
  }

  async activateOauth(user: User, params: ActivateOauthParams) {
    const { eventAgree, nickname } = params;

    const existingNickname = await this.prisma.user.findUnique({
      where: { nickname },
    });

    if (existingNickname) throw new BadRequestException('닉네임 중복');

    return await this.prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        nickname,
        eventAgree,
        status: UserStatus.CHARACTER_CHOOSE,
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
          profilePhoto: {
            create: { url: profile_image ?? BASE_PROFILE_PHOTO_S3_URL },
          },
          status: UserStatus.OAUTH_PENDING,
          provider,
          wallet: {
            create: {},
          },
        },
      });
    }

    return await this.genTokenAndUpdateUser({
      uuid: user.uuid,
      role: user.role,
    });
  }

  /**
   * @description 회원가입 후 처리
   */
  private async genTokenAndUpdateUser({
    uuid,
    role,
  }: {
    uuid: string;
    role: Role;
  }): Promise<TokenWithUser> {
    const generatedJwt: GeneratedJwt = this.authHelper.generateJwt({
      uuid,
      role,
    });

    const updatedUser = await this.prisma.user.update({
      where: { uuid },
      data: {
        lastLogin: new Date(),
        refreshToken: generatedJwt.refreshToken,
      },
    });

    return {
      email: updatedUser.email,
      generatedJwt,
    };
  }

  async withdraw(user: User) {
    return await this.prisma.user.update({
      data: {
        deletedAt: new Date(),
        status: UserStatus.WITHDRAWN,
        profilePhoto: {
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
      CacheKeyConstants.TEMP_PASSWORD_EMAIL(email),
      tempPassword,
      1000 * 60 * 5,
    );

    this.emailService.sendVerificationEmail(
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
      where: {
        email,
        deletedAt: null,
      },
    });

    if (!user) throw new UnauthorizedException('로그인 실패');

    if (user.provider) throw new BadRequestException('oauth 유저');

    if (user.loginFailCount > 10 && user.status === UserStatus.INACTIVE)
      throw new UnauthorizedException(
        `해당 이메일은 비밀번호를 10회 이상 틀려 비활성화 되었습니다. 관리자에게 문의하세요. ${this.configService.get('email.user')}`,
      );

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

    return await this.genTokenAndUpdateUser({
      uuid: user.uuid,
      role: user.role,
    });
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
    }
    throw new UnauthorizedException('로그인 실패');
  }

  /**
   * @description 임시 비밀번호를 발급받은 사용자 로직
   */
  private async isTempPassword(params: SignInParams): Promise<boolean> {
    const { email, password } = params;
    const tempPassword = await this.cacheManager.get(
      CacheKeyConstants.TEMP_PASSWORD_EMAIL(email),
    );

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
      this.cacheManager.del(CacheKeyConstants.TEMP_PASSWORD_EMAIL(email)),
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

    const verified = await this.cacheManager.get(
      CacheKeyConstants.VERIFIED_EMAIL(email),
    );
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
        status: UserStatus.CHARACTER_CHOOSE,
        profilePhoto: { create: { url: BASE_PROFILE_PHOTO_S3_URL } },
        wallet: { create: {} },
      },
      select: {
        email: true,
        eventAgree: true,
        nickname: true,
        wallet: {
          select: {
            money: true,
          },
        },
        profilePhoto: {
          select: {
            url: true,
          },
        },
      },
    });
  }

  async verifyCode(params: VerifyCodeParams) {
    const { email, code } = params;

    const cachedCode = await this.cacheManager.get(
      CacheKeyConstants.CODE(email),
    );

    if (cachedCode !== code)
      throw new UnauthorizedException('잘못된 인증 코드');

    await this.cacheManager.set(
      CacheKeyConstants.VERIFIED_EMAIL(email),
      1,
      60 * 30 * 1000,
    ); // 30분 이내로 가입 마치면 된다.

    return { message: `${email}: verified` };
  }

  async verifyEmail(param: VerifyEmailParam) {
    const { email } = param;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) throw new ConflictException('이메일 중복');

    const authCode = this.authHelper.generateVerificationCode();

    await this.cacheManager.set(
      CacheKeyConstants.CODE(email),
      authCode,
      60 * 30 * 1000,
    );

    this.emailService.sendVerificationEmail(email, authCode, 'email-verify', 3);

    return { message: '인증 코드가 발송되었습니다.' };
  }
}
