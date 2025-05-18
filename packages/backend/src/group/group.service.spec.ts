import { Test, TestingModule } from '@nestjs/testing';
import { GroupService } from './group.service';
import { PrismaService } from '@/prisma/prisma.service';
import {
  Group,
  GroupDate,
  GroupProgressStatus,
  Join,
  JoinRole,
  ProofMethod,
  ProofType,
  Role,
  User,
  UserStatus,
  Wallet,
  WalletHistoryReason,
} from '@prisma/client';
import { GetGroupsRes } from './dtos/get-groups-res.dto';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { S3Service } from '@/s3/s3.service';
import { createMock } from '@golevelup/ts-jest';
import { GroupWith, GroupWithProofDate } from './utils/types';
import { GetGroupsQueryDto } from './dtos/get-groups-query.dto';
import { CharacterRewardService } from '@/character/character-reward.service';

// 공통으로 사용되는 mock 객체들
const mockUser: User = createMock<User>({
  id: 1,
  uuid: 'test-uuid',
  email: 'test@example.com',
  nickname: 'testUser',
  role: Role.USER,
  status: UserStatus.ACTIVE,
});

const mockGetGroupsQuery: GetGroupsQueryDto = createMock<GetGroupsQueryDto>({
  take: 10,
});

const mockGroupId = 1;
const mockJoinGroupParam = { groupId: mockGroupId };

describe('GroupService', () => {
  let service: GroupService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        S3Service,
        {
          provide: CharacterRewardService,
          useValue: {
            rewardProof: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            group: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              delete: jest.fn(),
            },
            wallet: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            join: {
              findFirst: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
            },
            groupProgress: {
              createMany: jest.fn(),
            },
            $transaction: jest.fn((callback) => callback(prismaService)),
          },
        },
      ],
    }).compile();

    service = module.get<GroupService>(GroupService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  /**
   * @description getGroups 테스트
   */
  describe('getGroups', () => {
    beforeEach(() => {
      // 테스트를 위해 현재 시간을 2024-03-10으로 고정
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-03-10'));
    });

    it('유효한 날짜의 그룹만 반환해야 함', async () => {
      // Given
      const mockGroups = createMock<GroupWith[]>([
        {
          id: 1,
          title: '미래 모임',
          price: 30000,
          description: '미래에 진행될 모임',
          groupDate: [
            { date: '2024-03-15' },
            { date: '2024-03-16' },
            { date: '2024-03-17' },
          ],
          groupTagMap: [],
          join: [],
          proofMethod: [],
        },
        {
          id: 2,
          title: '과거 모임',
          price: 20000,
          description: '이미 종료된 모임',
          groupDate: [
            { date: '2024-03-01' },
            { date: '2024-03-02' },
            { date: '2024-03-03' },
          ],
          groupTagMap: [],
          join: [],
          proofMethod: [],
        },
      ]);

      jest.spyOn(prismaService.group, 'findMany').mockResolvedValue(mockGroups);

      // When
      const result = await service.getGroups(mockUser, mockGetGroupsQuery);

      // Then
      expect(result).toBeInstanceOf(GetGroupsRes);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe(1);
      expect(result.items[0].title).toBe('미래 모임');
    });

    it('빈 그룹 배열이 주어졌을 때 빈 결과를 반환해야 함', async () => {
      // Given
      jest.spyOn(prismaService.group, 'findMany').mockResolvedValue([]);

      // When
      const result = await service.getGroups(mockUser, mockGetGroupsQuery);

      // Then
      expect(result).toBeInstanceOf(GetGroupsRes);
      expect(result.items).toHaveLength(0);
    });

    it('모든 그룹의 날짜가 과거인 경우 빈 결과를 반환해야 함', async () => {
      // Given
      const mockGroups = createMock<GroupWith[]>([
        {
          id: 1,
          title: '과거 모임 1',
          price: 30000,
          description: '이미 종료된 모임 1',
          groupDate: [{ date: '2024-03-01' }, { date: '2024-03-02' }],
        },
        {
          id: 2,
          title: '과거 모임 2',
          price: 20000,
          description: '이미 종료된 모임 2',
          groupDate: [{ date: '2024-03-05' }, { date: '2024-03-06' }],
        },
      ]);

      jest.spyOn(prismaService.group, 'findMany').mockResolvedValue(mockGroups);

      // When
      const result = await service.getGroups(mockUser, mockGetGroupsQuery);

      // Then
      expect(result).toBeInstanceOf(GetGroupsRes);
      expect(result.items).toHaveLength(0);
    });
  });

  /**
   * @description joinGroup 테스트
   */
  describe('joinGroup', () => {
    describe('joinGroup', () => {
      beforeEach(() => {
        // 테스트를 위해 현재 시간을 2024-03-10으로 고정
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2024-03-10'));
      });

      it('모임 참여 성공', async () => {
        // Given
        const mockGroup = createMock<
          Group & {
            proofMethod: ProofMethod[];
            groupDate: GroupDate[];
          }
        >({
          id: mockGroupId,
          title: '테스트 모임',
          price: 30000,
          description: '테스트 모임입니다',
          proofMethod: [],
          groupDate: [
            {
              date: '2024-03-15',
              groupId: mockGroupId,
            },
            {
              date: '2024-03-16',
              groupId: mockGroupId,
            },
            {
              date: '2024-03-17',
              groupId: mockGroupId,
            },
          ],
        });

        const mockWallet = createMock<Wallet>({
          id: 1,
          userId: mockUser.id,
          money: 50000,
        });

        const mockJoin = createMock<Join>({
          id: 1,
          userId: mockUser.id,
          groupId: mockGroupId,
          joinRole: JoinRole.ATTENDEE,
        });

        const mockUpdatedWallet = createMock<Wallet>({
          ...mockWallet,
          money: mockWallet.money - mockGroup.price,
        });

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
        jest
          .spyOn(prismaService.groupProgress, 'createMany')
          .mockResolvedValue({ count: 1 });

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
          select: {
            id: true,
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
        ).rejects.toThrow(
          new NotFoundException('참여할 수 있는 날짜가 없습니다.'),
        );
      });

      it('잔액이 부족할 경우 에러 발생', async () => {
        // Given
        const mockGroup = createMock<
          Group & {
            proofMethod: ProofMethod[];
            groupDate: GroupDate[];
          }
        >({
          id: mockGroupId,
          title: '테스트 모임',
          price: 30000,
          description: '테스트 설명',
          proofMethod: [],
          groupDate: [
            {
              id: 1,
              groupId: mockGroupId,
              date: '2024-03-20',
            },
          ],
        });

        const mockWallet = createMock<Wallet>({
          id: 1,
          userId: mockUser.id,
          money: 20000,
        });

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
        const mockGroup = createMock<
          Group & {
            proofMethod: ProofMethod[];
            groupDate: GroupDate[];
          }
        >({
          id: mockGroupId,
          title: '테스트 모임',
          price: 30000,
          description: '테스트 설명',
          proofMethod: [],
          groupDate: [
            {
              id: 1,
              groupId: mockGroupId,
              date: '2024-03-20',
            },
          ],
        });

        const mockWallet = createMock<Wallet>({
          id: 1,
          userId: mockUser.id,
          money: 50000,
        });

        const existingJoin = createMock<Join>({
          id: 1,
          userId: mockUser.id,
          groupId: mockGroupId,
          joinRole: JoinRole.ATTENDEE,
        });

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
        const mockGroup = createMock<
          Group & {
            proofMethod: ProofMethod[];
            groupDate: GroupDate[];
          }
        >({
          id: mockGroupId,
          title: '테스트 모임',
          price: 30000,
          description: '테스트 설명',
          proofMethod: [],
          groupDate: [
            {
              id: 1,
              groupId: mockGroupId,
              date: '2024-03-01',
            },
          ],
        });

        const mockWallet = createMock<Wallet>({
          id: 1,
          userId: mockUser.id,
          money: 50000,
        });

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
        ).rejects.toThrow(
          new ForbiddenException('참여할 수 있는 날짜가 없습니다.'),
        );
      });
    });

    describe('joinGroup - 중간 참여 테스트', () => {
      beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2024-03-15T15:00:00Z'));
      });

      it('중간 참여시 남은 날짜만큼의 인증 머니를 차감해야 함', async () => {
        // Given
        const mockGroup = createMock<GroupWithProofDate>({
          id: mockGroupId,
          title: '테스트 모임',
          price: 30000, // 총 인증 머니
          description: '테스트 모임입니다',
          proofMethod: [
            {
              id: 1,
              contents: '인증 방법1',
              type: ProofType.CHECK_LOCATION,
              fromMin: 0,
              toMin: 2400,
              groupId: mockGroupId,
            },
            {
              id: 2,
              contents: '인증 방법2',
              type: ProofType.CHECK_LOCATION,
              fromMin: 0,
              toMin: 2400,
              groupId: mockGroupId,
            },
          ],
          groupDate: [
            {
              id: 1,
              date: '2024-03-14', // 지난 날짜
              groupId: mockGroupId,
            },
            {
              id: 2,
              date: '2024-03-15', // 오늘
              groupId: mockGroupId,
            },
            {
              id: 3,
              date: '2024-03-16', // 미래
              groupId: mockGroupId,
            },
            {
              id: 4,
              date: '2024-03-17', // 미래
              groupId: mockGroupId,
            },
          ],
        });

        const mockWallet = createMock<Wallet>({
          id: 1,
          userId: mockUser.id,
          money: 50000,
        });

        const mockJoin = createMock<Join>({
          id: 1,
          userId: mockUser.id,
          groupId: mockGroupId,
          joinRole: JoinRole.ATTENDEE,
        });

        // 전체 4일 중 1일 참여 가능 (오늘 포함 미래 날짜) -> 7,500원 차감
        const expectedJoinMoney = Math.floor((mockGroup.price * 1) / 4);
        const mockUpdatedWallet = {
          ...mockWallet,
          money: mockWallet.money - expectedJoinMoney,
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
        jest
          .spyOn(prismaService.groupProgress, 'createMany')
          .mockResolvedValue({ count: 6 });

        // When
        const result = await service.joinGroup(mockUser, mockJoinGroupParam);

        // Then
        expect(result).toEqual({
          group: mockGroup,
          wallet: mockUpdatedWallet,
        });

        // 지갑 업데이트 검증
        expect(prismaService.wallet.update).toHaveBeenCalledWith({
          where: { userId: mockUser.id, deletedAt: null },
          data: {
            money: { decrement: expectedJoinMoney },
            walletHistory: {
              create: {
                previousMoney: mockWallet.money,
                currentMoney: mockWallet.money - expectedJoinMoney,
                reason: WalletHistoryReason.JOIN,
                joinId: mockJoin.id,
              },
            },
          },
        });

        // GroupProgress 생성 검증 - 참여 가능한 날짜(3일)와 인증 방법(2개)에 대해서만 생성
        const expectedGroupProgressData = mockGroup.groupDate
          .filter((date) => date.date >= '2024-03-17')
          .flatMap((date) =>
            mockGroup.proofMethod.map((method) => ({
              groupDateId: date.id,
              joinId: mockJoin.id,
              proofMethodId: method.id,
              status: GroupProgressStatus.PENDING,
            })),
          );

        expect(prismaService.groupProgress.createMany).toHaveBeenCalledWith({
          data: expectedGroupProgressData,
        });
        expect(expectedGroupProgressData).toHaveLength(2); // 1일 * 2개 인증방법 = 2개
      });

      it('오늘 이후 참여 가능한 날짜가 없는 경우 에러 발생', async () => {
        // Given
        const mockGroup = createMock<GroupWithProofDate>({
          id: mockGroupId,
          title: '테스트 모임',
          price: 30000,
          description: '테스트 모임입니다',
          proofMethod: [
            {
              id: 1,
              contents: '인증 방법1',
              type: ProofType.CHECK_LOCATION,
              fromMin: 0,
              toMin: 2400,
              groupId: mockGroupId,
            },
          ],
          groupDate: [
            {
              id: 1,
              date: '2024-03-13',
              groupId: mockGroupId,
            },
            {
              id: 2,
              date: '2024-03-14',
              groupId: mockGroupId,
            },
          ],
        });

        const mockWallet = createMock<Wallet>({
          id: 1,
          userId: mockUser.id,
          money: 50000,
        });

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
        ).rejects.toThrow(
          new ForbiddenException('참여할 수 있는 날짜가 없습니다.'),
        );
      });
    });
  });

  /**
   * @description group progress 테스트
   */
  describe('joinGroup - GroupProgress 생성 테스트', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-03-10'));
    });

    it('groupDate 수 * proofMethod 수만큼 GroupProgress가 생성되어야 함', async () => {
      // Given
      const mockGroup = createMock<
        Group & {
          proofMethod: ProofMethod[];
          groupDate: GroupDate[];
        }
      >({
        id: mockGroupId,
        title: '테스트 모임',
        price: 30000,
        description: '테스트 모임입니다',
        proofMethod: [
          {
            id: 1,
            contents: '인증 방법1',
            type: ProofType.CHECK_LOCATION,
            fromMin: 0,
            toMin: 2400,
            groupId: mockGroupId,
          },
          {
            id: 2,
            contents: '인증 방법2',
            type: ProofType.CHECK_LOCATION,
            fromMin: 0,
            toMin: 2400,
            groupId: mockGroupId,
          },
        ],
        groupDate: [
          {
            id: 1,
            date: '2024-03-15',
            groupId: mockGroupId,
          },
          {
            id: 2,
            date: '2024-03-16',
            groupId: mockGroupId,
          },
          {
            id: 3,
            date: '2024-03-17',
            groupId: mockGroupId,
          },
        ],
      });

      const mockWallet = createMock<Wallet>({
        id: 1,
        userId: mockUser.id,
        money: 50000,
      });

      const mockJoin = createMock<Join>({
        id: 1,
        userId: mockUser.id,
        groupId: mockGroupId,
        joinRole: JoinRole.ATTENDEE,
      });

      jest
        .spyOn(prismaService.group, 'findUnique')
        .mockResolvedValue(mockGroup);
      jest
        .spyOn(prismaService.wallet, 'findUnique')
        .mockResolvedValue(mockWallet);
      jest.spyOn(prismaService.join, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prismaService.join, 'create').mockResolvedValue(mockJoin);
      jest
        .spyOn(prismaService.groupProgress, 'createMany')
        .mockResolvedValue({ count: 6 });
      jest.spyOn(prismaService.wallet, 'update').mockResolvedValue({
        ...mockWallet,
        money: mockWallet.money - mockGroup.price,
      });

      // When
      await service.joinGroup(mockUser, mockJoinGroupParam);

      // Then
      const expectedGroupProgressData = mockGroup.groupDate.flatMap((date) =>
        mockGroup.proofMethod.map((method) => ({
          groupDateId: date.id,
          joinId: mockJoin.id,
          proofMethodId: method.id,
          status: GroupProgressStatus.PENDING,
        })),
      );

      expect(prismaService.groupProgress.createMany).toHaveBeenCalledWith({
        data: expectedGroupProgressData,
      });

      // 생성된 GroupProgress 개수 확인 (3개 날짜 * 2개 인증방법 = 6개)
      expect(expectedGroupProgressData).toHaveLength(6);
    });
  });

  /**
   * @description leaveGroup 테스트
   */
  describe('leaveGroup', () => {
    const mockLeaveGroupParam = { groupId: mockGroupId };

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-03-10T12:00:00Z'));
    });

    it('모임 탈퇴 성공 (일반 참여자)', async () => {
      // Given
      const mockGroup = createMock<
        Group & { join: Join[]; groupDate: GroupDate[] }
      >({
        id: mockGroupId,
        title: '테스트 모임',
        price: 30000,
        description: '테스트 모임입니다',
        join: [
          {
            id: 1,
            userId: 2, // 호스트
            groupId: mockGroupId,
            joinRole: JoinRole.HOST,
          },
          {
            id: 2,
            userId: mockUser.id, // 일반 참여자
            groupId: mockGroupId,
            joinRole: JoinRole.ATTENDEE,
          },
        ],
        groupDate: [
          {
            id: 1,
            groupId: mockGroupId,
            date: '2024-03-20', // 미래 날짜
          },
        ],
      });

      const mockJoin = createMock<Join>({
        id: 2,
        userId: mockUser.id,
        groupId: mockGroupId,
        joinRole: JoinRole.ATTENDEE,
        createdAt: new Date('2024-03-09T12:00:00Z'), // 어제 참여
      });

      const mockWallet = createMock<Wallet>({
        id: 1,
        userId: mockUser.id,
        money: 50000,
      });

      const mockDeletedJoin = {
        ...mockJoin,
        groupProgress: [],
      };

      const mockUpdatedWallet = {
        ...mockWallet,
        money: mockWallet.money + mockGroup.price,
      };

      jest
        .spyOn(prismaService.group, 'findUnique')
        .mockResolvedValue(mockGroup);
      jest.spyOn(prismaService.join, 'findFirst').mockResolvedValue(mockJoin);
      jest
        .spyOn(prismaService.wallet, 'findUnique')
        .mockResolvedValue(mockWallet);
      jest
        .spyOn(prismaService.join, 'delete')
        .mockResolvedValue(mockDeletedJoin);
      jest
        .spyOn(prismaService.wallet, 'update')
        .mockResolvedValue(mockUpdatedWallet);
      jest.spyOn(prismaService.group, 'delete').mockResolvedValue(null);

      // When
      const result = await service.leaveGroup(mockUser, mockLeaveGroupParam);

      // Then
      expect(result).toEqual({
        deletedJoin: mockDeletedJoin,
        deletedGroup: false,
        updatedWallet: mockUpdatedWallet,
      });

      expect(prismaService.join.delete).toHaveBeenCalledWith({
        where: { id: mockJoin.id, deletedAt: null },
        include: {
          groupProgress: true,
        },
      });

      expect(prismaService.wallet.update).toHaveBeenCalledWith({
        where: { userId: mockUser.id, deletedAt: null },
        data: {
          money: { increment: mockGroup.price },
          walletHistory: {
            create: {
              previousMoney: mockWallet.money,
              currentMoney: mockWallet.money + mockGroup.price,
              reason: WalletHistoryReason.REFUND,
              joinId: mockGroup.join[0].id,
            },
          },
        },
      });

      expect(prismaService.group.delete).not.toHaveBeenCalled();
    });

    it('모임 탈퇴 성공 (마지막 참여자이면 모임도 삭제됨)', async () => {
      // Given
      const mockGroup = createMock<
        Group & { join: Join[]; groupDate: GroupDate[] }
      >({
        id: mockGroupId,
        title: '테스트 모임',
        price: 30000,
        description: '테스트 모임입니다',
        join: [
          {
            id: 1,
            userId: mockUser.id, // 유일한 참여자(호스트)
            groupId: mockGroupId,
            joinRole: JoinRole.HOST,
          },
        ],
        groupDate: [
          {
            id: 1,
            groupId: mockGroupId,
            date: '2024-03-20', // 미래 날짜
          },
        ],
      });

      const mockJoin = createMock<Join>({
        id: 1,
        userId: mockUser.id,
        groupId: mockGroupId,
        joinRole: JoinRole.HOST,
        createdAt: new Date('2024-03-09T12:00:00Z'), // 어제 참여
      });

      const mockWallet = createMock<Wallet>({
        id: 1,
        userId: mockUser.id,
        money: 50000,
      });

      const mockDeletedJoin = {
        ...mockJoin,
        groupProgress: [],
      };

      const mockUpdatedWallet = {
        ...mockWallet,
        money: mockWallet.money + mockGroup.price,
      };

      const mockDeletedGroup = {
        ...mockGroup,
        groupTagMap: [],
        proofMethod: [],
      };

      jest
        .spyOn(prismaService.group, 'findUnique')
        .mockResolvedValue(mockGroup);
      jest.spyOn(prismaService.join, 'findFirst').mockResolvedValue(mockJoin);
      jest
        .spyOn(prismaService.wallet, 'findUnique')
        .mockResolvedValue(mockWallet);
      jest
        .spyOn(prismaService.join, 'delete')
        .mockResolvedValue(mockDeletedJoin);
      jest
        .spyOn(prismaService.wallet, 'update')
        .mockResolvedValue(mockUpdatedWallet);
      jest
        .spyOn(prismaService.group, 'delete')
        .mockResolvedValue(mockDeletedGroup);

      // When
      const result = await service.leaveGroup(mockUser, mockLeaveGroupParam);

      // Then
      expect(result).toEqual({
        deletedJoin: mockDeletedJoin,
        deletedGroup: mockDeletedGroup,
        updatedWallet: mockUpdatedWallet,
      });

      expect(prismaService.group.delete).toHaveBeenCalledWith({
        where: { id: mockGroupId },
        include: {
          groupTagMap: true,
          proofMethod: true,
          groupDate: true,
        },
      });
    });

    it('존재하지 않는 모임일 경우 에러 발생', async () => {
      // Given
      jest.spyOn(prismaService.group, 'findUnique').mockResolvedValue(null);

      // When & Then
      await expect(
        service.leaveGroup(mockUser, mockLeaveGroupParam),
      ).rejects.toThrow(new NotFoundException('모임이 존재하지 않습니다.'));
    });

    it('참여하지 않은 모임일 경우 에러 발생', async () => {
      // Given
      const mockGroup = createMock<
        Group & { join: Join[]; groupDate: GroupDate[] }
      >({
        id: mockGroupId,
        join: [],
        groupDate: [],
      });

      jest
        .spyOn(prismaService.group, 'findUnique')
        .mockResolvedValue(mockGroup);
      jest.spyOn(prismaService.join, 'findFirst').mockResolvedValue(null);

      // When & Then
      await expect(
        service.leaveGroup(mockUser, mockLeaveGroupParam),
      ).rejects.toThrow(new NotFoundException('참여자가 존재하지 않습니다.'));
    });

    it('환불 불가능한 모임일 경우 에러 발생', async () => {
      // Given
      const mockGroup = createMock<
        Group & { join: Join[]; groupDate: GroupDate[] }
      >({
        id: mockGroupId,
        price: 30000,
        join: [
          {
            id: 1,
            userId: mockUser.id,
            groupId: mockGroupId,
            joinRole: JoinRole.ATTENDEE,
          },
        ],
        groupDate: [
          {
            id: 1,
            groupId: mockGroupId,
            date: '2024-03-11', // 내일 날짜 (모임 시작 24시간 이내)
          },
        ],
      });

      const mockJoin = createMock<Join>({
        id: 1,
        userId: mockUser.id,
        groupId: mockGroupId,
        joinRole: JoinRole.ATTENDEE,
        createdAt: new Date('2024-03-08T12:00:00Z'), // 참여한지 2일 지남
      });

      const mockWallet = createMock<Wallet>({
        id: 1,
        userId: mockUser.id,
        money: 50000,
      });

      jest
        .spyOn(prismaService.group, 'findUnique')
        .mockResolvedValue(mockGroup);
      jest.spyOn(prismaService.join, 'findFirst').mockResolvedValue(mockJoin);
      jest
        .spyOn(prismaService.wallet, 'findUnique')
        .mockResolvedValue(mockWallet);

      // When & Then
      await expect(
        service.leaveGroup(mockUser, mockLeaveGroupParam),
      ).rejects.toThrow(new BadRequestException('환불할 수 없는 모임입니다.'));
    });

    it('호스트가 다른 참여자가 있는 상태에서 1시간 이후에 탈퇴 시도 에러', async () => {
      // Given
      const currentTime = new Date('2024-03-10T12:00:00Z');
      const joinTimeBefore2Hours = new Date(
        currentTime.getTime() - 2 * 60 * 60 * 1000,
      ); // 2시간 전

      const mockGroup = createMock<
        Group & { join: Join[]; groupDate: GroupDate[] }
      >({
        id: mockGroupId,
        price: 30000,
        join: [
          {
            id: 1,
            userId: mockUser.id,
            groupId: mockGroupId,
            joinRole: JoinRole.HOST,
          },
          {
            id: 2,
            userId: 2, // 다른 참여자
            groupId: mockGroupId,
            joinRole: JoinRole.ATTENDEE,
          },
          {
            id: 3,
            userId: 3, // 다른 참여자
            groupId: mockGroupId,
            joinRole: JoinRole.ATTENDEE,
          },
        ],
        groupDate: [
          {
            id: 1,
            groupId: mockGroupId,
            date: '2024-03-20', // 미래 날짜
          },
        ],
      });

      const mockJoin = createMock<Join>({
        id: 1,
        userId: mockUser.id,
        groupId: mockGroupId,
        joinRole: JoinRole.HOST,
        createdAt: joinTimeBefore2Hours,
      });

      const mockWallet = createMock<Wallet>({
        id: 1,
        userId: mockUser.id,
        money: 50000,
      });

      jest
        .spyOn(prismaService.group, 'findUnique')
        .mockResolvedValue(mockGroup);
      jest.spyOn(prismaService.join, 'findFirst').mockResolvedValue(mockJoin);
      jest
        .spyOn(prismaService.wallet, 'findUnique')
        .mockResolvedValue(mockWallet);

      // When & Then
      await expect(
        service.leaveGroup(mockUser, mockLeaveGroupParam),
      ).rejects.toThrow(
        new BadRequestException(
          '다른 사람이 참여했을 경우 주최자는 탈퇴할 수 없습니다. 관리자에게 문의해주세요.',
        ),
      );
    });

    it('지갑이 존재하지 않을 경우 에러 발생', async () => {
      // Given
      const mockGroup = createMock<
        Group & { join: Join[]; groupDate: GroupDate[] }
      >({
        id: mockGroupId,
        join: [
          {
            id: 1,
            userId: mockUser.id,
            groupId: mockGroupId,
            joinRole: JoinRole.ATTENDEE,
          },
        ],
        groupDate: [],
      });

      const mockJoin = createMock<Join>({
        id: 1,
        userId: mockUser.id,
        groupId: mockGroupId,
        joinRole: JoinRole.ATTENDEE,
      });

      jest
        .spyOn(prismaService.group, 'findUnique')
        .mockResolvedValue(mockGroup);
      jest.spyOn(prismaService.join, 'findFirst').mockResolvedValue(mockJoin);
      jest.spyOn(prismaService.wallet, 'findUnique').mockResolvedValue(null);

      // When & Then
      await expect(
        service.leaveGroup(mockUser, mockLeaveGroupParam),
      ).rejects.toThrow(new NotFoundException('지갑이 존재하지 않습니다.'));
    });
  });
});
