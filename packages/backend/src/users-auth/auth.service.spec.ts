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
});
