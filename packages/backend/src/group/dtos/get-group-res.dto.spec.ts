import { createMock } from '@golevelup/ts-jest';
import { GroupStatus, JoinStatus } from '../utils/enums';
import { UserWithPhoto, GroupWith } from '../utils/types';
import { GetGroupRes } from './get-group-res.dto';

describe('GetGroupRes', () => {
  const mockUser = createMock<UserWithPhoto>({
    id: 1,
    email: 'test@example.com',
  });

  describe('getDetails', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('시작 전인 그룹은 NOT_STARTED 상태여야 함', () => {
      // Given
      jest.setSystemTime(new Date('2024-03-10'));
      const mockGroup = createMock<GroupWith>({
        groupDate: [
          { date: '2024-03-15' },
          { date: '2024-03-16' },
          { date: '2024-03-17' },
        ],
        join: [
          {
            userId: mockUser.id,
            user: mockUser,
          },
        ],
      });

      // When
      const result = GetGroupRes.getDetails(mockGroup, mockUser);

      // Then
      expect(result.status).toBe(GroupStatus.NOT_STARTED);
      expect(result.joinStatus).toBe(JoinStatus.RESERVED);
      expect(result.startDate).toBe('2024-03-15');
      expect(result.endDate).toBe('2024-03-17');
    });

    it('진행 중인 그룹은 IN_PROGRESS 상태여야 함', () => {
      // Given
      jest.setSystemTime(new Date('2024-03-16'));
      const mockGroup = createMock<GroupWith>({
        groupDate: [
          { date: '2024-03-15' },
          { date: '2024-03-16' },
          { date: '2024-03-17' },
        ],
        join: [
          {
            userId: mockUser.id,
            user: mockUser,
          },
        ],
      });

      // When
      const result = GetGroupRes.getDetails(mockGroup, mockUser);

      // Then
      expect(result.status).toBe(GroupStatus.IN_PROGRESS);
      expect(result.joinStatus).toBe(JoinStatus.IN_PROGRESS);
    });

    it('종료된 그룹은 COMPLETED 상태여야 함', () => {
      // Given
      jest.setSystemTime(new Date('2024-03-19'));
      const mockGroup = createMock<GroupWith>({
        groupDate: [
          { date: '2024-03-15' },
          { date: '2024-03-16' },
          { date: '2024-03-17' },
        ],
        join: [
          {
            userId: mockUser.id,
            user: mockUser,
          },
        ],
      });

      // When
      const result = GetGroupRes.getDetails(mockGroup, mockUser);

      // Then
      expect(result.status).toBe(GroupStatus.COMPLETED);
      expect(result.joinStatus).toBe(JoinStatus.COMPLETED);
    });

    it('마지막 날 자정까지는 IN_PROGRESS 상태여야 함', () => {
      // Given
      jest.setSystemTime(new Date('2024-03-17T23:59:59+09:00'));
      const mockGroup = createMock<GroupWith>({
        groupDate: [
          { date: '2024-03-15' },
          { date: '2024-03-16' },
          { date: '2024-03-17' },
        ],
        join: [
          {
            userId: mockUser.id,
            user: mockUser,
          },
        ],
      });

      // When
      const result = GetGroupRes.getDetails(mockGroup, mockUser);

      // Then
      expect(result.status).toBe(GroupStatus.IN_PROGRESS);
      expect(result.joinStatus).toBe(JoinStatus.IN_PROGRESS);
    });

    it('참여하지 않은 사용자의 경우 NOT_JOINED 상태여야 함', () => {
      // Given
      jest.setSystemTime(new Date('2024-03-10'));
      const mockGroup = createMock<GroupWith>({
        groupDate: [
          { date: '2024-03-15' },
          { date: '2024-03-16' },
          { date: '2024-03-17' },
        ],
        join: [],
      });

      // When
      const result = GetGroupRes.getDetails(mockGroup, mockUser);

      // Then
      expect(result.status).toBe(GroupStatus.NOT_STARTED);
      expect(result.joinStatus).toBe(JoinStatus.NOT_JOINED);
    });

    it('참여 가능한 날짜가 없는 경우 NOT_JOINABLE 상태여야 함', () => {
      // Given
      jest.setSystemTime(new Date('2024-03-17T00:00:00+09:00'));
      const mockGroup = createMock<GroupWith>({
        groupDate: [
          { date: '2024-03-15' },
          { date: '2024-03-16' },
          { date: '2024-03-17' },
        ],
        join: [],
      });

      // When
      const result = GetGroupRes.getDetails(mockGroup, mockUser);

      // Then
      expect(result.status).toBe(GroupStatus.IN_PROGRESS);
      expect(result.joinStatus).toBe(JoinStatus.NOT_JOINABLE);
    });
  });
});
