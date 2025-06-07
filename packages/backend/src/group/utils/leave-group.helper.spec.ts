import { createMock } from '@golevelup/ts-jest';
import {
  JoinRole,
  GroupProgressStatus,
  GroupProgress,
  GroupDate,
} from '@prisma/client';
import { LeaveGroupHelper } from './leave-group.helper';
import { JoinForLeave, GroupForLeave } from './types';
import { PrismaService } from '@/prisma/prisma.service';

describe('LeaveGroupHelper', () => {
  const prisma = createMock<PrismaService>();

  const createMockJoin = (
    createdAt: Date,
    joinRole: JoinRole = JoinRole.ATTENDEE,
    hasProgress: boolean = false,
  ): JoinForLeave =>
    createMock<JoinForLeave>({
      joinRole,
      createdAt,
      groupProgress: hasProgress
        ? [
            createMock<GroupProgress>({
              status: GroupProgressStatus.COMPLETED,
            }),
          ]
        : [],
    });

  const createMockGroup = (groupDates: string[]): GroupForLeave =>
    createMock<GroupForLeave>({
      groupDate: groupDates.map((date) =>
        createMock<GroupDate>({
          date,
        }),
      ),
    });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('canRefund', () => {
    it('groupProgress가 존재하면 환불 불가능해야 한다', () => {
      // Given
      const mockJoin = createMockJoin(
        new Date('2025-06-10T00:00:00+09:00'),
        JoinRole.ATTENDEE,
        true,
      );
      const mockGroup = createMockGroup([
        '2025-06-09',
        '2025-06-10',
        '2025-06-11',
        '2025-06-12',
        '2025-06-13',
      ]);

      // When
      const helper = new LeaveGroupHelper(mockJoin, mockGroup, prisma);

      // Then
      expect(helper.canRefund()).toBe(false);
    });

    it('참여 후 1시간 내에는 환불 가능해야 한다', () => {
      // Given
      const joinTime = new Date('2025-06-09T23:59:59+09:00');
      const currentTime = new Date('2025-06-10T00:30:00+09:00'); // 30분 후

      jest.setSystemTime(new Date(currentTime));

      const mockJoin = createMockJoin(joinTime);
      const mockGroup = createMockGroup([
        '2025-06-09',
        '2025-06-10',
        '2025-06-11',
        '2025-06-12',
        '2025-06-13',
      ]);

      // When
      const helper = new LeaveGroupHelper(mockJoin, mockGroup, prisma);

      // Then
      expect(helper.canRefund()).toBe(true);
    });

    it('참여 후 1시간이 지나면 1시간 내 환불 조건은 적용되지 않는다', () => {
      // Given
      const joinTime = new Date('2025-06-09T23:59:59+09:00');
      const currentTime = new Date('2025-06-10T01:00:00+09:00'); // 1시간 이미 지남

      jest.setSystemTime(new Date(currentTime));

      const mockJoin = createMockJoin(joinTime);
      const mockGroup = createMockGroup([
        '2025-06-09',
        '2025-06-10',
        '2025-06-11',
        '2025-06-12',
        '2025-06-13',
      ]);

      // When
      const helper = new LeaveGroupHelper(mockJoin, mockGroup, prisma);

      // Then
      expect(helper.canRefund()).toBe(false);
    });

    it('가장 빠른 그룹 날짜 이전에는 환불 가능해야 한다', () => {
      // Given
      const joinTime = new Date('2025-06-09T15:00:00+09:00');
      const currentTime = new Date('2025-06-11T15:00:00+09:00'); // 그룹 날짜 전날

      jest.setSystemTime(new Date(currentTime));

      const mockJoin = createMockJoin(joinTime);
      const mockGroup = createMockGroup([
        '2025-06-09',
        '2025-06-13',
        '2025-06-14',
        '2025-06-15',
        '2025-06-16',
      ]);

      // When
      const helper = new LeaveGroupHelper(mockJoin, mockGroup, prisma);

      // Then
      expect(helper.canRefund()).toBe(true);
    });

    it('참여 이후 그룹 날짜의 당일 시작 전까지는 환불 가능해야 한다', () => {
      // Given
      const joinTime = new Date('2025-06-08T15:00:00+09:00');
      const currentTime = new Date('2025-06-08T23:59:59+09:00'); // 그룹 날짜 당일 자정 직전

      jest.setSystemTime(new Date(currentTime));

      const mockJoin = createMockJoin(joinTime);
      const mockGroup = createMockGroup([
        '2025-06-09',
        '2025-06-10',
        '2025-06-11',
        '2025-06-12',
        '2025-06-13',
      ]);

      // When
      const helper = new LeaveGroupHelper(mockJoin, mockGroup, prisma);

      // Then
      expect(helper.canRefund()).toBe(true);
    });

    it('참여 이후 그룹 날짜의 당일이 시작되면 환불 불가능해야 한다', () => {
      // Given
      const joinTime = new Date('2025-06-08T15:00:00+09:00');
      const currentTime = new Date('2025-06-09T00:00:00+09:00'); // 그룹 날짜 당일 자정

      jest.setSystemTime(new Date(currentTime));

      const mockJoin = createMockJoin(joinTime);
      const mockGroup = createMockGroup([
        '2025-06-09',
        '2025-06-10',
        '2025-06-11',
        '2025-06-12',
        '2025-06-13',
      ]);

      // When
      const helper = new LeaveGroupHelper(mockJoin, mockGroup, prisma);

      // Then
      expect(helper.canRefund()).toBe(false);
    });
  });
});
