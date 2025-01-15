import { DateInterface } from './types';
import {
  getLastDayNight,
  isValidGroup,
  getFirstDay,
  validateGroupDates,
} from './utils';

describe('Group Utils', () => {
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
