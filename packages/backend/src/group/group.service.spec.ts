import { Test, TestingModule } from '@nestjs/testing';
import { GroupService } from './group.service';
import { PrismaService } from '@/prisma/prisma.service';
import { JoinRole, User, WalletHistoryReason } from '@prisma/client';
import { GetGroupsRes } from './dtos/get-groups-res.dto';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { GroupStatus } from './utils/enums';

/**
 * @description getGroups 테스트
 */
describe('GroupService', () => {
  let service: GroupService;
  let prismaService: PrismaService;

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
    provider: null,
    role: 'USER',
    status: 'ACTIVE',
    lastLogin: null,
    lastPwdChanged: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    loginFailCount: 0,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        {
          provide: PrismaService,
          useValue: {
            group: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<GroupService>(GroupService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getGroups', () => {
    beforeEach(() => {
      // 테스트를 위해 현재 시간을 2024-03-10으로 고정
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-03-10'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('유효한 날짜의 그룹만 반환해야 함', async () => {
      // Given
      const mockGroups = [
        {
          id: 1,
          title: '미래 모임',
          price: 30000,
          description: '미래에 진행될 모임',
          proofMethod: '인증 방법',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          groupDate: [
            { date: '2024-03-15' },
            { date: '2024-03-16' },
            { date: '2024-03-17' },
          ],
          groupTagMap: [],
          join: [],
        },
        {
          id: 2,
          title: '과거 모임',
          price: 20000,
          description: '이미 종료된 모임',
          proofMethod: '인증 방법',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          groupDate: [
            { date: '2024-03-01' },
            { date: '2024-03-02' },
            { date: '2024-03-03' },
          ],
          groupTagMap: [],
          join: [],
        },
      ];

      jest.spyOn(prismaService.group, 'findMany').mockResolvedValue(mockGroups);

      // When
      const result = await service.getGroups(mockUser);

      // Then
      expect(result).toBeInstanceOf(GetGroupsRes);
      expect(result.groups).toHaveLength(1);
      expect(result.groups[0].id).toBe(1);
      expect(result.groups[0].title).toBe('미래 모임');
    });

    it('빈 그룹 배열이 주어졌을 때 빈 결과를 반환해야 함', async () => {
      // Given
      jest.spyOn(prismaService.group, 'findMany').mockResolvedValue([]);

      // When
      const result = await service.getGroups(mockUser);

      // Then
      expect(result).toBeInstanceOf(GetGroupsRes);
      expect(result.groups).toHaveLength(0);
    });

    it('모든 그룹의 날짜가 과거인 경우 빈 결과를 반환해야 함', async () => {
      // Given
      const mockGroups = [
        {
          id: 1,
          title: '과거 모임 1',
          price: 30000,
          description: '이미 종료된 모임 1',
          proofMethod: '인증 방법',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          groupDate: [{ date: '2024-03-01' }, { date: '2024-03-02' }],
          groupTagMap: [],
          join: [],
        },
        {
          id: 2,
          title: '과거 모임 2',
          price: 20000,
          description: '이미 종료된 모임 2',
          proofMethod: '인증 방법',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          groupDate: [{ date: '2024-03-05' }, { date: '2024-03-06' }],
          groupTagMap: [],
          join: [],
        },
      ];

      jest.spyOn(prismaService.group, 'findMany').mockResolvedValue(mockGroups);

      // When
      const result = await service.getGroups(mockUser);

      // Then
      expect(result).toBeInstanceOf(GetGroupsRes);
      expect(result.groups).toHaveLength(0);
    });
  });
});

/**
 * @description joinGroup 테스트
 */
describe('GroupService', () => {
  let service: GroupService;
  let prismaService: PrismaService;

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
    provider: null,
    role: 'USER',
    status: 'ACTIVE',
    lastLogin: null,
    lastPwdChanged: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    loginFailCount: 0,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        {
          provide: PrismaService,
          useValue: {
            group: {
              findUnique: jest.fn(),
            },
            wallet: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            join: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
            $transaction: jest.fn((callback) => callback(prismaService)),
          },
        },
      ],
    }).compile();

    service = module.get<GroupService>(GroupService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('joinGroup', () => {
    const mockGroupId = 1;
    const mockJoinGroupParam = { groupId: mockGroupId };

    beforeEach(() => {
      // 테스트를 위해 현재 시간을 2024-03-10으로 고정
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-03-10'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('모임 참여 성공', async () => {
      // Given
      const mockGroup = {
        id: mockGroupId,
        title: '테스트 모임',
        price: 30000,
        description: '테스트 모임입니다',
        proofMethod: '인증 방법',
        groupDate: [
          {
            date: '2024-03-20',
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const mockWallet = {
        id: 1,
        userId: mockUser.id,
        money: 50000,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const mockJoin = {
        id: 1,
        userId: mockUser.id,
        groupId: mockGroupId,
        joinRole: JoinRole.ATTENDEE,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const mockUpdatedWallet = {
        ...mockWallet,
        money: mockWallet.money - mockGroup.price,
      };

      jest
        .spyOn(prismaService.group, 'findUnique')
        .mockResolvedValue(mockGroup);
      jest
        .spyOn(prismaService.wallet, 'findUnique')
        .mockResolvedValue(mockWallet);
      jest.spyOn(prismaService.join, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prismaService.join, 'create').mockResolvedValue(mockJoin);
      jest
        .spyOn(prismaService.wallet, 'update')
        .mockResolvedValue(mockUpdatedWallet);

      // When
      const result = await service.joinGroup(mockUser, mockJoinGroupParam);

      // Then
      expect(result).toEqual({
        group: mockGroup,
        wallet: mockUpdatedWallet,
      });

      expect(prismaService.join.create).toHaveBeenCalledWith({
        data: {
          userId: mockUser.id,
          groupId: mockGroupId,
          joinRole: JoinRole.ATTENDEE,
        },
      });

      expect(prismaService.wallet.update).toHaveBeenCalledWith({
        where: { userId: mockUser.id, deletedAt: null },
        data: {
          money: { decrement: mockGroup.price },
          walletHistory: {
            create: {
              previousMoney: mockWallet.money,
              currentMoney: mockWallet.money - mockGroup.price,
              reason: WalletHistoryReason.JOIN,
              joinId: mockJoin.id,
            },
          },
        },
      });
    });

    it('존재하지 않는 모임일 경우 에러 발생', async () => {
      // Given
      jest.spyOn(prismaService.group, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.wallet, 'findUnique').mockResolvedValue({
        id: 1,
        userId: mockUser.id,
        money: 50000,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });
      jest.spyOn(prismaService.join, 'findFirst').mockResolvedValue(null);

      // When & Then
      await expect(
        service.joinGroup(mockUser, mockJoinGroupParam),
      ).rejects.toThrow(new NotFoundException('모임이 존재하지 않습니다.'));
    });

    it('잔액이 부족할 경우 에러 발생', async () => {
      // Given
      const mockGroup = {
        id: mockGroupId,
        title: '테스트 모임',
        price: 30000,
        description: '테스트 설명',
        proofMethod: '인증 방법',
        status: GroupStatus.NOT_STARTED,
        groupDate: [
          {
            id: 1,
            groupId: mockGroupId,
            date: '2024-03-20',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const mockWallet = {
        id: 1,
        userId: mockUser.id,
        money: 20000,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest
        .spyOn(prismaService.group, 'findUnique')
        .mockResolvedValue(mockGroup);
      jest
        .spyOn(prismaService.wallet, 'findUnique')
        .mockResolvedValue(mockWallet);
      jest.spyOn(prismaService.join, 'findFirst').mockResolvedValue(null);

      // When & Then
      await expect(
        service.joinGroup(mockUser, mockJoinGroupParam),
      ).rejects.toThrow(new ForbiddenException('잔액이 부족합니다.'));
    });

    it('이미 참여한 모임일 경우 에러 발생', async () => {
      // Given
      const mockGroup = {
        id: mockGroupId,
        title: '테스트 모임',
        price: 30000,
        description: '테스트 설명',
        proofMethod: '인증 방법',
        status: GroupStatus.NOT_STARTED,
        groupDate: [
          {
            id: 1,
            groupId: mockGroupId,
            date: '2024-03-20',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const mockWallet = {
        id: 1,
        userId: mockUser.id,
        money: 50000,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const existingJoin = {
        id: 1,
        userId: mockUser.id,
        groupId: mockGroupId,
        joinRole: JoinRole.ATTENDEE,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest
        .spyOn(prismaService.group, 'findUnique')
        .mockResolvedValue(mockGroup);
      jest
        .spyOn(prismaService.wallet, 'findUnique')
        .mockResolvedValue(mockWallet);
      jest
        .spyOn(prismaService.join, 'findFirst')
        .mockResolvedValue(existingJoin);

      // When & Then
      await expect(
        service.joinGroup(mockUser, mockJoinGroupParam),
      ).rejects.toThrow(new ForbiddenException('이미 참여한 모임입니다.'));
    });

    it('만료된 모임일 경우 에러 발생', async () => {
      // Given
      const mockGroup = {
        id: mockGroupId,
        title: '테스트 모임',
        price: 30000,
        description: '테스트 설명',
        proofMethod: '인증 방법',
        status: GroupStatus.NOT_STARTED,
        groupDate: [
          {
            id: 1,
            groupId: mockGroupId,
            date: '2024-03-01',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const mockWallet = {
        id: 1,
        userId: mockUser.id,
        money: 50000,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest
        .spyOn(prismaService.group, 'findUnique')
        .mockResolvedValue(mockGroup);
      jest
        .spyOn(prismaService.wallet, 'findUnique')
        .mockResolvedValue(mockWallet);
      jest.spyOn(prismaService.join, 'findFirst').mockResolvedValue(null);

      // When & Then
      await expect(
        service.joinGroup(mockUser, mockJoinGroupParam),
      ).rejects.toThrow(new NotFoundException('모임이 존재하지 않습니다.'));
    });
  });
});
