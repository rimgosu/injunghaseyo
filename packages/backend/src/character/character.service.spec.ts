import { Test, TestingModule } from '@nestjs/testing';
import { CharacterService } from './character.service';
import { PrismaService } from '@/prisma/prisma.service';
import { CharacterInfoSelect } from './utils/types';
import { ExpHistoryType, GroupProgressStatus } from '@prisma/client';
import { getToday } from '@/group/utils/utils';

class TestCharacterService extends CharacterService {
  public testCheckLevelUp(
    params: Parameters<CharacterService['checkLevelUp']>[0],
  ) {
    return this.checkLevelUp(params);
  }
}

describe('CharacterService', () => {
  let service: TestCharacterService;

  const mockPrismaService = {
    groupProgress: {
      findMany: jest.fn(),
    },
    group: {
      findFirst: jest.fn(),
    },
    myCharacter: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    expHistory: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestCharacterService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TestCharacterService>(TestCharacterService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkLevelUp', () => {
    const mockCharacterInfo: CharacterInfoSelect[] = [
      { level: 1, expNeed: 0 },
      { level: 2, expNeed: 100 },
      { level: 3, expNeed: 225 },
      { level: 4, expNeed: 375 },
      { level: 5, expNeed: 575 },
    ];

    it('레벨업이 발생하지 않은 경우', () => {
      const result = service.testCheckLevelUp({
        beforeTotalExp: 150,
        afterTotalExp: 160,
        characterInfo: mockCharacterInfo,
      });

      expect(result).toEqual({
        levelUp: false,
        beforeLevel: 2,
        afterLevel: 2,
      });
    });

    it('레벨업이 발생한 경우', () => {
      const result = service.testCheckLevelUp({
        beforeTotalExp: 220,
        afterTotalExp: 230,
        characterInfo: mockCharacterInfo,
      });

      expect(result).toEqual({
        levelUp: true,
        beforeLevel: 2,
        afterLevel: 3,
      });
    });

    it('여러 레벨의 경험치를 가진 경우 올바른 레벨을 반환', () => {
      const result = service.testCheckLevelUp({
        beforeTotalExp: 400,
        afterTotalExp: 600,
        characterInfo: mockCharacterInfo,
      });

      expect(result).toEqual({
        levelUp: true,
        beforeLevel: 4,
        afterLevel: 5,
      });
    });
  });

  describe('rewardSignIn', () => {
    const userId = 1;
    const todayTs = new Date(getToday('kst')).getTime();

    it('이미 출석체크를 한 경우 void를 반환해야 합니다', async () => {
      // Given
      mockPrismaService.myCharacter.findUnique.mockResolvedValueOnce({
        userId,
        totalExp: 0,
        ExpHistory: [
          {
            type: ExpHistoryType.ATTENDANCE_CHECK_REWARD,
            createdAt: new Date(todayTs),
          },
        ],
      });

      // When
      const result = await service.rewardSignIn(userId);

      // Then
      expect(result).toBeUndefined();
      expect(mockPrismaService.myCharacter.update).not.toHaveBeenCalled();
    });

    it('출석체크 보상이 제대로 지급되어야 합니다', async () => {
      // Given
      mockPrismaService.myCharacter.findUnique.mockResolvedValueOnce({
        userId,
        totalExp: 0,
        ExpHistory: [],
      });

      mockPrismaService.myCharacter.update.mockResolvedValueOnce({
        totalExp: 1,
        character: {
          characterInfo: [
            { level: 1, expNeed: 0 },
            { level: 2, expNeed: 100 },
          ],
        },
      });

      // When
      await service.rewardSignIn(userId);

      // Then
      expect(mockPrismaService.myCharacter.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            totalExp: { increment: 1 },
            ExpHistory: {
              create: {
                type: ExpHistoryType.ATTENDANCE_CHECK_REWARD,
                increasedExp: 1,
              },
            },
          },
        }),
      );
    });

    it('레벨업 시에만 레벨업 정보를 반환해야 합니다', async () => {
      // Given
      mockPrismaService.myCharacter.findUnique.mockResolvedValueOnce({
        userId,
        totalExp: 99,
        ExpHistory: [],
      });

      mockPrismaService.myCharacter.update.mockResolvedValueOnce({
        totalExp: 100,
        character: {
          characterInfo: [
            { level: 1, expNeed: 0 },
            { level: 2, expNeed: 100 },
            { level: 3, expNeed: 225 },
          ],
        },
      });

      // When
      const result = await service.rewardSignIn(userId);

      // Then
      expect(result).toEqual({
        levelUp: true,
        beforeLevel: 1,
        afterLevel: 2,
      });
    });
  });

  describe('rewardProof', () => {
    const mockParams = {
      joinId: 1,
      groupDateId: 1,
      userId: 1,
    };

    mockPrismaService.expHistory.findUnique.mockResolvedValueOnce(null);

    it('모든 proofMethod가 완료되지 않았을 때 undefined를 반환해야 함', async () => {
      // Given
      mockPrismaService.groupProgress.findMany.mockResolvedValue([
        { status: GroupProgressStatus.COMPLETED },
        { status: GroupProgressStatus.PENDING },
      ]);

      // When
      const result = await service.rewardProof(mockParams);

      // Then
      expect(result).toBeUndefined();
      expect(mockPrismaService.myCharacter.update).not.toHaveBeenCalled();
    });

    it('경험치 증가량이 올바르게 계산되어야 함', async () => {
      // Given
      mockPrismaService.groupProgress.findMany.mockResolvedValue([
        { status: GroupProgressStatus.COMPLETED },
        { status: GroupProgressStatus.COMPLETED },
      ]);
      mockPrismaService.group.findFirst.mockResolvedValue({
        price: 30000,
        _count: {
          groupDate: 10,
        },
      });
      mockPrismaService.myCharacter.update.mockResolvedValue({
        totalExp: 0,
        character: {
          characterInfo: [
            { level: 1, expNeed: 0 },
            { level: 2, expNeed: 100 },
            { level: 3, expNeed: 225 },
          ],
        },
      });

      // When
      await service.rewardProof(mockParams);

      // Then
      const expectedExp = Math.ceil((46 * 30000) / 10000 / 10); // PROOF_REWARD_EXP_PER_10000WON * price / 10000 / groupDateCount
      expect(mockPrismaService.myCharacter.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            totalExp: {
              increment: expectedExp,
            },
          }),
        }),
      );
    });

    it('모든 proofMethod가 완료되었을 때 경험치가 정상적으로 지급되어야 함', async () => {
      // Given
      mockPrismaService.groupProgress.findMany.mockResolvedValue([
        { status: GroupProgressStatus.COMPLETED },
        { status: GroupProgressStatus.COMPLETED },
      ]);
      mockPrismaService.group.findFirst.mockResolvedValue({
        price: 30000,
        _count: {
          groupDate: 10,
        },
      });
      mockPrismaService.myCharacter.update.mockResolvedValue({
        totalExp: 150,
        character: {
          characterInfo: [
            { level: 1, expNeed: 0 },
            { level: 2, expNeed: 100 },
            { level: 3, expNeed: 225 },
          ],
        },
      });

      // When
      await service.rewardProof(mockParams);

      // Then
      expect(mockPrismaService.myCharacter.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            ExpHistory: {
              create: expect.objectContaining({
                type: ExpHistoryType.PROOF_REWARD,
                groupDateId: mockParams.groupDateId,
                joinId: mockParams.joinId,
              }),
            },
          }),
        }),
      );
    });

    it('레벨업이 발생했을 때 레벨업 정보를 반환해야 함', async () => {
      // Given
      const beforeExp = 90;
      mockPrismaService.groupProgress.findMany.mockResolvedValue([
        { status: GroupProgressStatus.COMPLETED },
      ]);
      mockPrismaService.group.findFirst.mockResolvedValue({
        price: 30000,
        _count: {
          groupDate: 3,
        },
      });
      mockPrismaService.expHistory.findUnique.mockResolvedValue(null);

      const increaseExp = Math.ceil((46 * 30000) / 10000 / 3); // 46원
      mockPrismaService.myCharacter.update.mockResolvedValue({
        totalExp: beforeExp + increaseExp,
        character: {
          characterInfo: [
            { level: 1, expNeed: 0 },
            { level: 2, expNeed: 100 },
            { level: 3, expNeed: 225 },
          ],
        },
      });

      // When
      const result = await service.rewardProof(mockParams);

      // Then
      expect(result).toEqual({
        levelUp: true,
        beforeLevel: 1,
        afterLevel: 2,
      });
    });
  });
});
