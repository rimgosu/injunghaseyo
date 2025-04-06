import { Test, TestingModule } from '@nestjs/testing';
import { CharacterService } from './character.service';
import { PrismaService } from '@/prisma/prisma.service';
import { CharacterInfoSelect } from './utils/types';

class TestCharacterService extends CharacterService {
  public testCheckLevelUp(
    params: Parameters<CharacterService['checkLevelUp']>[0],
  ) {
    return this.checkLevelUp(params);
  }
}

describe('CharacterService', () => {
  let service: TestCharacterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestCharacterService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TestCharacterService>(TestCharacterService);
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
});
