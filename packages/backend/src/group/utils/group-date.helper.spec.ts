import { createMock } from '@golevelup/ts-jest';
import { GroupDateHelper } from './group-date.helper';
import { GroupDate } from '@prisma/client';

describe('getJoinableDate', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('중간에 참여할 경우 참여 가능일은 다음날부터 해당한다.', () => {
    // Given
    jest.setSystemTime(new Date('2025-01-01T15:00:00Z'));

    const mockDates = createMock<GroupDate[]>([
      {
        date: '2025-01-01',
      },
      {
        date: '2025-01-02',
      },
      {
        date: '2025-01-03',
      },
    ]);

    const groupDateHelper = new GroupDateHelper(mockDates);

    // When
    const result = groupDateHelper.getJoinableDate();

    // Then
    expect(result).toEqual(mockDates.slice(2));
  });

  it('23시 59분 59초면 다음날 참여 가능해진다.', () => {
    // Given
    jest.setSystemTime(new Date('2025-01-01T14:59:59Z'));
    const mockDates = createMock<GroupDate[]>([
      {
        date: '2025-01-01',
      },
      {
        date: '2025-01-02',
      },
      {
        date: '2025-01-03',
      },
    ]);

    const groupDateHelper = new GroupDateHelper(mockDates);

    // When
    const result = groupDateHelper.getJoinableDate();

    // Then
    expect(result).toEqual(mockDates.slice(1));
  });

  it('이미 날짜가 지났다면 참여 가능일은 없다.', () => {
    // Given
    jest.setSystemTime(new Date('2025-01-02T15:00:00Z'));
    const mockDates = createMock<GroupDate[]>([
      {
        date: '2025-01-01',
      },
      {
        date: '2025-01-02',
      },
      {
        date: '2025-01-03',
      },
    ]);

    const groupDateHelper = new GroupDateHelper(mockDates);

    // When
    const result = groupDateHelper.getJoinableDate();

    // Then
    expect(result).toEqual([]);
  });
});
