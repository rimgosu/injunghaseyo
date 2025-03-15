import { createMock } from '@golevelup/ts-jest';
import { DateInterface } from './types';
import {
  getLastDayNight,
  isValidGroup,
  getFirstDay,
  validateGroupDates,
  canRefund,
  getToday,
  getJoinableDate,
  getCurrentMinute,
  isBetweenMinutes,
} from './utils';
import { GroupDate } from '@prisma/client';

describe('isBetweenMinutes', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('일반적인 시간대 (자정을 걸치지 않는 경우)', () => {
    it('시간이 범위 안에 있을 때 true를 반환해야 함', () => {
      // Given
      jest.setSystemTime(new Date('2024-03-15T06:30:00Z')); // KST 15:30

      // When
      const result = isBetweenMinutes(900, 960, 'kst'); // 15:00 - 16:00

      // Then
      expect(result).toBe(true);
    });

    it('시간이 범위 밖에 있을 때 false를 반환해야 함', () => {
      // Given
      jest.setSystemTime(new Date('2024-03-15T05:30:00Z')); // KST 14:30

      // When
      const result = isBetweenMinutes(900, 960, 'kst'); // 15:00 - 16:00

      // Then
      expect(result).toBe(false);
    });
  });

  describe('자정을 걸치는 시간대', () => {
    it('자정 이전 시간대가 범위 안에 있을 때 true를 반환해야 함', () => {
      // Given
      jest.setSystemTime(new Date('2024-03-15T13:30:00Z')); // KST 22:30

      // When
      const result = isBetweenMinutes(1260, 180, 'kst'); // 21:00 - 03:00

      // Then
      expect(result).toBe(true);
    });

    it('자정 이후 시간대가 범위 안에 있을 때 true를 반환해야 함', () => {
      // Given
      jest.setSystemTime(new Date('2024-03-15T16:30:00Z')); // KST 01:30

      // When
      const result = isBetweenMinutes(1260, 180, 'kst'); // 21:00 - 03:00

      // Then
      expect(result).toBe(true);
    });

    it('범위 밖의 시간일 때 false를 반환해야 함', () => {
      // Given
      jest.setSystemTime(new Date('2024-03-15T10:30:00Z')); // KST 19:30

      // When
      const result = isBetweenMinutes(1260, 180, 'kst'); // 21:00 - 03:00

      // Then
      expect(result).toBe(false);
    });
  });
});

describe('getCurrentMinute', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('KST 기준', () => {
    it('15:00 KST일 때 900을 반환해야 함', () => {
      // Given
      jest.setSystemTime(new Date('2024-03-15T06:00:00Z')); // UTC 6:00 = KST 15:00

      // When
      const result = getCurrentMinute('kst');

      // Then
      expect(result).toBe(900); // 15 * 60 = 900
    });

    it('23:59 KST일 때 1439를 반환해야 함', () => {
      // Given
      jest.setSystemTime(new Date('2024-03-15T14:59:00Z')); // UTC 14:59 = KST 23:59

      // When
      const result = getCurrentMinute('kst');

      // Then
      expect(result).toBe(1439); // 23 * 60 + 59 = 1439
    });

    it('00:00 KST일 때 0을 반환해야 함', () => {
      // Given
      jest.setSystemTime(new Date('2024-03-15T15:00:00Z')); // UTC 15:00 = KST 00:00

      // When
      const result = getCurrentMinute('kst');

      // Then
      expect(result).toBe(0);
    });

    it('타임존 파라미터가 없을 경우 기본값으로 KST를 사용해야 함', () => {
      // Given
      jest.setSystemTime(new Date('2024-03-15T06:00:00Z')); // UTC 6:00 = KST 15:00

      // When
      const result = getCurrentMinute();
      const resultWithKST = getCurrentMinute('kst');

      // Then
      expect(result).toBe(resultWithKST);
    });
  });

  describe('UTC 기준', () => {
    it('15:00 UTC일 때 900을 반환해야 함', () => {
      // Given
      jest.setSystemTime(new Date('2024-03-15T15:00:00Z'));

      // When
      const result = getCurrentMinute('utc');

      // Then
      expect(result).toBe(900);
    });

    it('23:59 UTC일 때 1439를 반환해야 함', () => {
      // Given
      jest.setSystemTime(new Date('2024-03-15T23:59:00Z'));

      // When
      const result = getCurrentMinute('utc');

      // Then
      expect(result).toBe(1439);
    });

    it('00:00 UTC일 때 0을 반환해야 함', () => {
      // Given
      jest.setSystemTime(new Date('2024-03-15T00:00:00Z'));

      // When
      const result = getCurrentMinute('utc');

      // Then
      expect(result).toBe(0);
    });
  });
});

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

    // When
    const result = getJoinableDate(mockDates);

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

    // When
    const result = getJoinableDate(mockDates);

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

    // When
    const result = getJoinableDate(mockDates);

    // Then
    expect(result).toEqual([]);
  });
});

describe('getToday', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('KST 기준', () => {
    it('KST 기준으로 오늘 날짜를 반환해야 함', () => {
      // Given
      jest.setSystemTime(new Date('2024-03-15T00:00:00Z')); // UTC 기준

      // When
      const result = getToday('kst');

      // Then
      expect(result).toBe('2024-03-15'); // UTC+9 적용
    });

    it('자정 이전 시간대에서도 올바른 날짜를 반환해야 함', () => {
      // Given
      jest.setSystemTime(new Date('2024-03-14T15:00:00Z')); // UTC 기준 (KST 03-15 00:00)

      // When
      const result = getToday('kst');

      // Then
      expect(result).toBe('2024-03-15');
    });

    it('timeZone 파라미터가 없을 경우 기본값으로 KST를 사용해야 함', () => {
      // Given
      jest.setSystemTime(new Date('2024-03-15T00:00:00Z'));

      // When
      const result = getToday();
      const resultWithKST = getToday('kst');

      // Then
      expect(result).toBe(resultWithKST);
    });
  });

  describe('UTC 기준', () => {
    it('UTC 기준으로 오늘 날짜를 반환해야 함', () => {
      // Given
      jest.setSystemTime(new Date('2024-03-15T00:00:00Z'));

      // When
      const result = getToday('utc');

      // Then
      expect(result).toBe('2024-03-15');
    });

    it('UTC와 KST의 날짜가 다른 경우를 처리해야 함', () => {
      // Given
      jest.setSystemTime(new Date('2024-03-14T15:00:00Z')); // UTC 03-14 15:00 (KST 03-15 00:00)

      // When
      const utcResult = getToday('utc');
      const kstResult = getToday('kst');

      // Then
      expect(utcResult).toBe('2024-03-14');
      expect(kstResult).toBe('2024-03-15');
    });
  });
});

describe('Group Utils', () => {
  describe('canRefund', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    describe('KST 기준', () => {
      it('모임이 이미 시작된 경우 환불 불가능', () => {
        // Given
        jest.setSystemTime(new Date('2024-03-10T10:00:00+09:00'));
        const joinDate = new Date('2024-03-08T00:00:00+09:00');
        const dates = ['2024-03-10', '2024-03-11', '2024-03-12'];

        // When
        const result = canRefund(joinDate, dates, 'kst');

        // Then
        expect(result).toBe(false);
      });

      it('모임 시작 정확히 24시간 전이면 환불 가능', () => {
        // Given
        jest.setSystemTime(new Date('2024-03-09T00:00:00+09:00'));
        const joinDate = new Date('2024-03-08T00:00:00+09:00');
        const dates = ['2024-03-10', '2024-03-11', '2024-03-12'];

        // When
        const result = canRefund(joinDate, dates, 'kst');

        // Then
        expect(result).toBe(true);
      });

      it('모임 시작 24시간 이내면 환불 불가능', () => {
        // Given
        jest.setSystemTime(new Date('2024-03-09T23:59:59+09:00'));
        const joinDate = new Date('2024-03-08T00:00:00+09:00');
        const dates = ['2024-03-10', '2024-03-11', '2024-03-12'];

        // When
        const result = canRefund(joinDate, dates, 'kst');

        // Then
        expect(result).toBe(false);
      });

      it('참여 후 1시간 이내면 환불 가능', () => {
        // Given
        jest.setSystemTime(new Date('2024-03-10T10:30:00+09:00'));
        const joinDate = new Date('2024-03-10T10:00:00+09:00');
        const dates = ['2024-03-15', '2024-03-16', '2024-03-17'];

        // When
        const result = canRefund(joinDate, dates, 'kst');

        // Then
        expect(result).toBe(true);
      });

      it('참여 후 1시간 초과면 환불 불가능', () => {
        // Given
        jest.setSystemTime(new Date('2024-03-15T11:01:00+09:00'));
        const joinDate = new Date('2024-03-15T10:00:00+09:00');
        const dates = ['2024-03-15', '2024-03-16', '2024-03-17'];

        // When
        const result = canRefund(joinDate, dates, 'kst');

        // Then
        expect(result).toBe(false);
      });
    });

    describe('UTC 기준', () => {
      it('모임 시작 24시간 전이면 환불 가능', () => {
        // Given
        jest.setSystemTime(new Date('2024-03-10T00:00:00Z'));
        const joinDate = new Date('2024-03-08T00:00:00Z');
        const dates = ['2024-03-11', '2024-03-12', '2024-03-13'];

        // When
        const result = canRefund(joinDate, dates, 'utc');

        // Then
        expect(result).toBe(true);
      });

      it('모임 시작 24시간 이내면 환불 불가능', () => {
        // Given
        jest.setSystemTime(new Date('2024-03-10T00:00:00Z'));
        const joinDate = new Date('2024-03-08T00:00:00Z');
        const dates = ['2024-03-10', '2024-03-11', '2024-03-12'];

        // When
        const result = canRefund(joinDate, dates, 'utc');

        // Then
        expect(result).toBe(false);
      });

      it('참여 후 1시간 이내면 환불 가능', () => {
        // Given
        jest.setSystemTime(new Date('2024-03-15T10:30:00Z'));
        const joinDate = new Date('2024-03-15T10:00:00Z');
        const dates = ['2024-03-15', '2024-03-16', '2024-03-17'];

        // When
        const result = canRefund(joinDate, dates, 'utc');

        // Then
        expect(result).toBe(true);
      });

      it('참여 후 1시간 초과면 환불 불가능', () => {
        // Given
        jest.setSystemTime(new Date('2024-03-15T11:01:00Z'));
        const joinDate = new Date('2024-03-15T10:00:00Z');
        const dates = ['2024-03-15', '2024-03-16', '2024-03-17'];

        // When
        const result = canRefund(joinDate, dates, 'utc');

        // Then
        expect(result).toBe(false);
      });
    });
  });

  describe('getLastDayNight', () => {
    it('날짜 배열에서 가장 늦은 날짜의 다음날 0시를 반환해야 함', () => {
      const dates: DateInterface[] = [
        { date: '2024-01-01' },
        { date: '2024-01-03' },
        { date: '2024-01-02' },
      ];

      const result = getLastDayNight(dates);
      const expected = new Date('2024-01-04').getTime();

      expect(result).toBe(expected);
    });

    it('동일한 날짜가 있는 경우에도 정상 동작해야 함', () => {
      const dates: DateInterface[] = [
        { date: '2024-01-01' },
        { date: '2024-01-01' },
        { date: '2024-01-01' },
      ];

      const result = getLastDayNight(dates);
      const expected = new Date('2024-01-02').getTime();

      expect(result).toBe(expected);
    });
  });

  describe('isValidGroup', () => {
    it('마지막 날짜가 현재보다 미래인 경우 true를 반환', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const result = isValidGroup(futureDate.getTime());
      expect(result).toBe(true);
    });

    it('마지막 날짜가 현재보다 과거인 경우 false를 반환', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const result = isValidGroup(pastDate.getTime());
      expect(result).toBe(false);
    });
  });

  describe('getFirstDay', () => {
    it('날짜 배열에서 가장 이른 날짜를 반환해야 함', () => {
      const dates = ['2024-01-03', '2024-01-01', '2024-01-02'];

      const result = getFirstDay(dates);
      const expected = new Date('2024-01-01').getTime();

      expect(result).toBe(expected);
    });

    it('동일한 날짜가 있는 경우에도 정상 동작해야 함', () => {
      const dates = ['2024-01-01', '2024-01-01', '2024-01-02'];

      const result = getFirstDay(dates);
      const expected = new Date('2024-01-01').getTime();

      expect(result).toBe(expected);
    });
  });

  describe('validateGroupDates', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-01T00:00:00+09:00'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    describe('UTC 기준', () => {
      it('시작 날짜가 3일 이후인 경우 true를 반환', () => {
        const dates = ['2024-01-05', '2024-01-06', '2024-01-07'];

        const result = validateGroupDates(dates, 'utc');
        expect(result).toBe(true);
      });

      it('시작 날짜가 3일 이내인 경우 false를 반환', () => {
        const dates = ['2024-01-02', '2024-01-03', '2024-01-04'];

        const result = validateGroupDates(dates, 'utc');
        expect(result).toBe(false);
      });

      it('시작 날짜가 정확히 3일 후인 경우 true를 반환', () => {
        const dates = ['2024-01-04', '2024-01-05', '2024-01-06'];

        const result = validateGroupDates(dates, 'utc');
        expect(result).toBe(true);
      });
    });

    describe('KST 기준', () => {
      it('시작 날짜가 3일 이후인 경우 true를 반환', () => {
        const dates = ['2024-01-05', '2024-01-06', '2024-01-07'];

        const result = validateGroupDates(dates, 'kst');
        expect(result).toBe(true);
      });

      it('시작 날짜가 3일 이내인 경우 false를 반환', () => {
        const dates = ['2024-01-02', '2024-01-03', '2024-01-04'];

        const result = validateGroupDates(dates, 'kst');
        expect(result).toBe(false);
      });

      it('시작 날짜가 정확히 3일 후인 경우 true를 반환', () => {
        const dates = ['2024-01-04', '2024-01-05', '2024-01-06'];

        const result = validateGroupDates(dates, 'kst');
        expect(result).toBe(true);
      });
    });

    it('타임존 파라미터가 없을 경우 기본값으로 KST를 사용', () => {
      const dates = ['2024-01-05', '2024-01-06', '2024-01-07'];

      const result = validateGroupDates(dates);
      const resultWithKST = validateGroupDates(dates, 'kst');

      expect(result).toBe(resultWithKST);
    });
  });
});
