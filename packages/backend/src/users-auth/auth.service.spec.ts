import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AuthService } from './auth.service';
import { AuthHelper } from './auth.helper';
import { Provider, Role, User, UserStatus } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '@/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { BASE_PROFILE_PHOTO_S3_URL } from '@/common/constants';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let cacheManager: Cache;

  const mockUser: User = {
    id: 1,
    uuid: 'test-uuid',
    email: 'test@example.com',
    nickname: 'testUser',
    introduction: '등록된 소개말이 없습니다.',
    refreshToken: null,
    eventAgree: true,
    password: 'hashedPassword',
    salt: 'salt',
    provider: null as Provider | null,
    role: 'USER' as Role,
    status: 'ACTIVE' as UserStatus,
    lastLogin: null,
    lastPwdChanged: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    loginFailCount: 0,
  };

  const mockGeneratedJwt = {
    accessToken: 'mockAccessToken',
    refreshToken: 'mockRefreshToken',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        AuthHelper,
        ConfigService,
        EmailService,
        JwtService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              update: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  describe('activateOauth', () => {
    const activateOauthParams = {
      eventAgree: true,
      nickname: 'newNickname',
      requireAgree: true,
    };

    it('OAuth 대기 상태의 유저 활성화 성공', async () => {
      // Given
      const oauthPendingUser = {
        ...mockUser,
        status: UserStatus.OAUTH_PENDING,
        provider: Provider.GOOGLE,
      };

      const expectedActivatedUser = {
        email: oauthPendingUser.email,
        nickname: activateOauthParams.nickname,
        eventAgree: activateOauthParams.eventAgree,
        provider: Provider.GOOGLE,
        status: UserStatus.ACTIVE,
      } as User;

      jest
        .spyOn(prismaService.user, 'update')
        .mockResolvedValue(expectedActivatedUser);

      // When
      const result = await service.activateOauth(
        oauthPendingUser,
        activateOauthParams,
      );

      // Then
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: {
          email: oauthPendingUser.email,
        },
        data: {
          nickname: activateOauthParams.nickname,
          eventAgree: activateOauthParams.eventAgree,
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

      expect(result).toEqual(expectedActivatedUser);
    });

    it('이미 활성화된 유저의 경우 BadRequestException 발생', async () => {
      // Given
      const activeUser = {
        ...mockUser,
        status: UserStatus.ACTIVE,
        provider: Provider.GOOGLE,
      };

      // When & Then
      await expect(
        service.activateOauth(activeUser, activateOauthParams),
      ).rejects.toThrow(
        new BadRequestException('oauth 활성화가 필요한 유저가 아닙니다.'),
      );

      expect(prismaService.user.update).not.toHaveBeenCalled();
    });

    it('일반 유저의 경우 BadRequestException 발생', async () => {
      // Given
      const normalUser = {
        ...mockUser,
        status: UserStatus.ACTIVE,
        provider: null,
      };

      // When & Then
      await expect(
        service.activateOauth(normalUser, activateOauthParams),
      ).rejects.toThrow(
        new BadRequestException('oauth 활성화가 필요한 유저가 아닙니다.'),
      );

      expect(prismaService.user.update).not.toHaveBeenCalled();
    });
  });

  describe('oauthLogin', () => {
    const mockOauthUser = {
      email: 'oauth@example.com',
      nickname: 'oauthUser',
      profile_image: 'https://example.com/profile.jpg',
    };

    it('OAuth 대기 상태의 기존 유저 로그인 성공', async () => {
      // Given
      const existingOAuthUser = {
        ...mockUser,
        email: mockOauthUser.email,
        nickname: mockOauthUser.nickname,
        status: UserStatus.OAUTH_PENDING,
        provider: Provider.GOOGLE,
      };

      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(existingOAuthUser);
      jest
        .spyOn(service['authHelper'], 'generateJwt')
        .mockReturnValue(mockGeneratedJwt);
      jest
        .spyOn(prismaService.user, 'update')
        .mockResolvedValue(existingOAuthUser);

      // When
      const result = await service.oauthLogin(mockOauthUser, Provider.GOOGLE);

      // Then
      expect(result).toEqual({
        email: existingOAuthUser.email,
        generatedJwt: mockGeneratedJwt,
      });
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockOauthUser.email },
      });
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { uuid: existingOAuthUser.uuid },
        data: expect.objectContaining({
          lastLogin: expect.any(Date),
          refreshToken: mockGeneratedJwt.refreshToken,
        }),
      });
    });

    it('신규 유저 생성 시 상태가 OAUTH_PENDING으로 설정됨', async () => {
      // Given
      const mockCreatedUser = {
        ...mockUser,
        ProfilePhoto: [],
        Join: [],
        PhotoComment: [],
        Payment: [],
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue({
        ...mockCreatedUser,
        status: UserStatus.OAUTH_PENDING,
        provider: Provider.GOOGLE,
      });
      jest
        .spyOn(service['authHelper'], 'generateJwt')
        .mockReturnValue(mockGeneratedJwt);
      jest
        .spyOn(prismaService.user, 'update')
        .mockResolvedValue(mockCreatedUser);

      // When
      await service.oauthLogin(mockOauthUser, Provider.GOOGLE);

      // Then
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: mockOauthUser.email,
          nickname: mockOauthUser.nickname,
          status: UserStatus.OAUTH_PENDING,
          provider: Provider.GOOGLE,
          ProfilePhoto: {
            create: { url: mockOauthUser.profile_image },
          },
        }),
      });
    });

    it('기존 유저가 있을 경우 로그인 성공', async () => {
      // Given
      const existingUser = {
        ...mockUser,
        email: mockOauthUser.email,
        nickname: mockOauthUser.nickname,
      };

      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(existingUser);
      jest
        .spyOn(service['authHelper'], 'generateJwt')
        .mockReturnValue(mockGeneratedJwt);
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(existingUser);

      // When
      const result = await service.oauthLogin(mockOauthUser, Provider.GOOGLE);

      // Then
      expect(result).toEqual({
        email: existingUser.email,
        generatedJwt: mockGeneratedJwt,
      });
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { uuid: existingUser.uuid },
        data: expect.objectContaining({
          lastLogin: expect.any(Date),
          refreshToken: mockGeneratedJwt.refreshToken,
        }),
      });
    });

    it('신규 유저일 경우 회원가입 후 로그인 성공', async () => {
      // Given
      const newUser = {
        ...mockUser,
        email: mockOauthUser.email,
        nickname: mockOauthUser.nickname,
        status: UserStatus.OAUTH_PENDING,
        provider: Provider.GOOGLE,
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(newUser);
      jest
        .spyOn(service['authHelper'], 'generateJwt')
        .mockReturnValue(mockGeneratedJwt);
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(newUser);

      // When
      const result = await service.oauthLogin(mockOauthUser, Provider.GOOGLE);

      // Then
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: mockOauthUser.email,
          nickname: mockOauthUser.nickname,
          eventAgree: false,
          status: UserStatus.OAUTH_PENDING,
          provider: Provider.GOOGLE,
          ProfilePhoto: {
            create: { url: mockOauthUser.profile_image },
          },
        }),
      });
      expect(result).toEqual({
        email: newUser.email,
        generatedJwt: mockGeneratedJwt,
      });
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { uuid: newUser.uuid },
        data: expect.objectContaining({
          lastLogin: expect.any(Date),
          refreshToken: mockGeneratedJwt.refreshToken,
        }),
      });
    });

    it('프로필 이미지가 없는 경우 기본 이미지로 회원가입', async () => {
      // Given
      const oauthUserWithoutImage = {
        ...mockOauthUser,
        profile_image: null,
      };
      const newUser = {
        ...mockUser,
        email: oauthUserWithoutImage.email,
        nickname: oauthUserWithoutImage.nickname,
        status: UserStatus.OAUTH_PENDING,
        provider: Provider.GOOGLE,
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(newUser);
      jest
        .spyOn(service['authHelper'], 'generateJwt')
        .mockReturnValue(mockGeneratedJwt);
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(newUser);

      // When
      const result = await service.oauthLogin(
        oauthUserWithoutImage,
        Provider.GOOGLE,
      );

      // Then
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          ProfilePhoto: {
            create: { url: BASE_PROFILE_PHOTO_S3_URL },
          },
        }),
      });
      expect(result).toEqual({
        email: newUser.email,
        generatedJwt: mockGeneratedJwt,
      });
    });
  });

  describe('signIn', () => {
    it('임시 비밀번호로 로그인 성공', async () => {
      // Given
      const signInParams = {
        email: 'test@example.com',
        password: 'tempPassword123',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(cacheManager, 'get').mockResolvedValue('tempPassword123');
      jest.spyOn(cacheManager, 'del').mockResolvedValue(undefined);
      jest
        .spyOn(prismaService.user, 'update')
        .mockResolvedValue({ ...mockUser });
      jest
        .spyOn(service['authHelper'], 'generateJwt')
        .mockReturnValue(mockGeneratedJwt);

      // When
      const result = await service.signIn(signInParams);

      // Then
      expect(result).toEqual({
        email: mockUser.email,
        generatedJwt: mockGeneratedJwt,
      });
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { uuid: mockUser.uuid },
        data: expect.objectContaining({
          refreshToken: mockGeneratedJwt.refreshToken,
        }),
      });
      expect(cacheManager.del).toHaveBeenCalled();
    });

    it('일반 비밀번호로 로그인 성공', async () => {
      // Given
      const signInParams = {
        email: 'test@example.com',
        password: 'normalPassword123',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest
        .spyOn(service['authHelper'], 'verifyPassword')
        .mockResolvedValue(true);
      jest
        .spyOn(service['authHelper'], 'generateJwt')
        .mockReturnValue(mockGeneratedJwt);
      jest
        .spyOn(prismaService.user, 'update')
        .mockResolvedValue({ ...mockUser });

      // When
      const result = await service.signIn(signInParams);

      // Then
      expect(result).toEqual({
        email: mockUser.email,
        generatedJwt: mockGeneratedJwt,
      });
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { uuid: mockUser.uuid },
        data: expect.objectContaining({
          refreshToken: mockGeneratedJwt.refreshToken,
        }),
      });
    });
  });

  describe('비밀번호 실패 케이스', () => {
    const signInParams = {
      email: 'test@example.com',
      password: 'wrongPassword',
    };

    it('비밀번호 10회 실패시 계정 비활성화', async () => {
      // Given
      const userWithFailCount = {
        ...mockUser,
        loginFailCount: 10,
      };

      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(userWithFailCount);
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest
        .spyOn(service['authHelper'], 'verifyPassword')
        .mockResolvedValue(false);

      const updateMock = jest.spyOn(prismaService.user, 'update');
      updateMock
        .mockResolvedValueOnce({ loginFailCount: 11 } as User) // 첫 번째 update 호출 (실패 카운트 증가)
        .mockResolvedValueOnce({
          ...userWithFailCount,
          status: UserStatus.INACTIVE,
        }); // 두 번째 update 호출 (계정 비활성화)

      // When & Then
      await expect(service.signIn(signInParams)).rejects.toThrow(
        new UnauthorizedException(
          `해당 이메일은 비활성화 되었습니다. 관리자에게 문의하세요. ${undefined}`,
        ),
      );

      expect(updateMock).toHaveBeenCalledTimes(2);
      expect(updateMock).toHaveBeenNthCalledWith(1, {
        where: { email: signInParams.email },
        data: { loginFailCount: 11 },
        select: { loginFailCount: true },
      });
      expect(updateMock).toHaveBeenNthCalledWith(2, {
        where: { email: signInParams.email },
        data: { status: UserStatus.INACTIVE },
      });
    });

    it('비밀번호 실패시 loginFailCount 증가', async () => {
      // Given
      const userWithFailCount = {
        ...mockUser,
        loginFailCount: 5,
      };

      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(userWithFailCount);
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest
        .spyOn(service['authHelper'], 'verifyPassword')
        .mockResolvedValue(false);

      const updateMock = jest.spyOn(prismaService.user, 'update');
      updateMock.mockResolvedValueOnce({ loginFailCount: 6 } as User);

      // When & Then
      await expect(service.signIn(signInParams)).rejects.toThrow(
        new UnauthorizedException('로그인 실패'),
      );

      expect(updateMock).toHaveBeenCalledTimes(1);
      expect(updateMock).toHaveBeenCalledWith({
        where: { email: signInParams.email },
        data: { loginFailCount: 6 },
        select: { loginFailCount: true },
      });
    });

    it('임시 비밀번호가 아닐 경우 비밀번호 검증 실행', async () => {
      // Given
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest
        .spyOn(service['authHelper'], 'verifyPassword')
        .mockResolvedValue(false);

      const updateMock = jest.spyOn(prismaService.user, 'update');
      updateMock.mockResolvedValueOnce({ loginFailCount: 1 } as User);

      // When & Then
      await expect(service.signIn(signInParams)).rejects.toThrow(
        new UnauthorizedException('로그인 실패'),
      );

      expect(service['authHelper'].verifyPassword).toHaveBeenCalledWith(
        signInParams.password,
        mockUser.password,
        mockUser.salt,
      );
    });
  });
});
