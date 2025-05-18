import { GroupProgressStatus } from '@prisma/client';
import { GetTodayRewardRes } from './get-today-reward-res.dto';
import { GroupWithJoinForReward } from '../utils/types';
import { createMock } from '@golevelup/ts-jest';

describe('GetTodayRewardRes', () => {
  describe('constructor', () => {
    it('복잡한 상황에서도 보상이 올바르게 계산되어야 함', () => {
      // Given
      const mockGroup = createMock<GroupWithJoinForReward>({
        price: 100000,
        proofMethod: [{ id: 1 }, { id: 2 }],
        join: [{ id: 1 }],
        groupDate: [
          {
            id: 1,
            groupProgress: [
              // 첫째 날: 참여자1, 2 성공 / 참여자3 실패
              { joinId: 1, status: GroupProgressStatus.COMPLETED },
              { joinId: 1, status: GroupProgressStatus.COMPLETED },
              { joinId: 2, status: GroupProgressStatus.COMPLETED },
              { joinId: 2, status: GroupProgressStatus.COMPLETED },
              { joinId: 3, status: GroupProgressStatus.COMPLETED },
              { joinId: 3, status: GroupProgressStatus.PENDING },
            ],
          },
          {
            id: 2,
            groupProgress: [
              // 둘째 날: 참여자1 성공 / 참여자2, 3 실패
              { joinId: 1, status: GroupProgressStatus.COMPLETED },
              { joinId: 1, status: GroupProgressStatus.COMPLETED },
              { joinId: 2, status: GroupProgressStatus.PENDING },
              { joinId: 2, status: GroupProgressStatus.COMPLETED },
              { joinId: 3, status: GroupProgressStatus.PENDING },
              { joinId: 3, status: GroupProgressStatus.PENDING },
            ],
          },
          {
            id: 3,
            groupProgress: [
              // 셋째 날: 모든 참여자 성공
              { joinId: 1, status: GroupProgressStatus.COMPLETED },
              { joinId: 1, status: GroupProgressStatus.COMPLETED },
              { joinId: 2, status: GroupProgressStatus.COMPLETED },
              { joinId: 2, status: GroupProgressStatus.COMPLETED },
              { joinId: 3, status: GroupProgressStatus.COMPLETED },
              { joinId: 3, status: GroupProgressStatus.COMPLETED },
            ],
          },
        ],
      });

      // When
      const result = new GetTodayRewardRes(mockGroup);

      // Then
      expect(result.todayReward).toBe(146664);
    });

    it('모두 성공할 시 NET * groupPrice여야 한다.', () => {
      // Given
      const mockGroup = createMock<GroupWithJoinForReward>({
        price: 100000,
        proofMethod: [{ id: 1 }, { id: 2 }],
        join: [{ id: 1 }],
        groupDate: [
          {
            id: 1,
            groupProgress: [
              // 모든 참여자 성공
              { joinId: 1, status: GroupProgressStatus.COMPLETED },
              { joinId: 1, status: GroupProgressStatus.COMPLETED },
              { joinId: 2, status: GroupProgressStatus.COMPLETED },
              { joinId: 2, status: GroupProgressStatus.COMPLETED },
              { joinId: 3, status: GroupProgressStatus.COMPLETED },
              { joinId: 3, status: GroupProgressStatus.COMPLETED },
            ],
          },
        ],
      });

      // When
      const totalPool = mockGroup.price;

      // 각 참여자별 보상 계산
      const rewards = mockGroup.join.map((join) => {
        const groupWithSingleJoin = {
          ...mockGroup,
          join: [join],
        };
        const res = new GetTodayRewardRes(groupWithSingleJoin);
        return res.todayReward;
      });

      const totalRewards = rewards.reduce((acc, cur) => acc + cur, 0);

      // Then
      expect(totalRewards).toBeLessThanOrEqual(totalPool);
      expect(totalRewards).toBe(80000); // NET(0.8) * 100000
    });

    it('일일 보상을 올바르게 계산해야 함', () => {
      // Given
      const mockGroup = createMock<GroupWithJoinForReward>({
        price: 30000,
        proofMethod: [{ id: 1 }, { id: 2 }],
        join: [{ id: 1 }],
        groupDate: [
          {
            id: 1,
            groupProgress: [
              {
                joinId: 1,
                status: GroupProgressStatus.COMPLETED,
              },
              {
                joinId: 1,
                status: GroupProgressStatus.COMPLETED,
              },
              {
                joinId: 2,
                status: GroupProgressStatus.COMPLETED,
              },
              {
                joinId: 2,
                status: GroupProgressStatus.COMPLETED,
              },
            ],
          },
          {
            id: 2,
            groupProgress: [
              {
                joinId: 1,
                status: GroupProgressStatus.COMPLETED,
              },
              {
                joinId: 1,
                status: GroupProgressStatus.COMPLETED,
              },
              {
                joinId: 2,
                status: GroupProgressStatus.PENDING,
              },
              {
                joinId: 2,
                status: GroupProgressStatus.PENDING,
              },
            ],
          },
        ],
      });

      // When
      const result = new GetTodayRewardRes(mockGroup);

      // Then
      // 일일 가격: 30000원 * 2 / 2일 = 30000원
      // NET: 0.8
      // 첫째 날: (30000 * 0.8) / 2명 = 12000원
      // 둘째 날: (30000 * 0.8) / 1명 = 24000원
      // 총 보상: 36000원
      expect(result.todayReward).toBe(36000);
    });

    it('인증에 실패한 경우 보상을 받지 않아야 함', () => {
      // Given
      const mockGroup = createMock<GroupWithJoinForReward>({
        price: 30000,
        proofMethod: [{ id: 1 }, { id: 2 }],
        join: [{ id: 1 }],
        groupDate: [
          {
            id: 1,
            groupProgress: [
              {
                joinId: 1,
                status: GroupProgressStatus.PENDING,
              },
              {
                joinId: 1,
                status: GroupProgressStatus.COMPLETED,
              },
            ],
          },
        ],
      });

      // When
      const result = new GetTodayRewardRes(mockGroup);

      // Then
      expect(result.todayReward).toBe(0);
    });

    it('참여자가 없는 경우 보상은 0이어야 함', () => {
      // Given
      const mockGroup = createMock<GroupWithJoinForReward>({
        price: 30000,
        proofMethod: [{ id: 1 }],
        join: [{ id: 1 }],
        groupDate: [
          {
            id: 1,
            groupProgress: [],
          },
        ],
      });

      // When
      const result = new GetTodayRewardRes(mockGroup);

      // Then
      expect(result.todayReward).toBe(0);
    });

    it('모든 인증 방법을 완료해야 보상을 받을 수 있음', () => {
      // Given
      const mockGroup = createMock<GroupWithJoinForReward>({
        price: 30000,
        proofMethod: [{ id: 1 }, { id: 2 }],
        join: [{ id: 1 }],
        groupDate: [
          {
            id: 1,
            groupProgress: [
              {
                joinId: 1,
                status: GroupProgressStatus.COMPLETED,
              },
              {
                joinId: 1,
                status: GroupProgressStatus.PENDING,
              },
            ],
          },
        ],
      });

      // When
      const result = new GetTodayRewardRes(mockGroup);

      // Then
      expect(result.todayReward).toBe(0);
    });
  });
});
