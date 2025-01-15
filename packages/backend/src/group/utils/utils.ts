import { DateInterface, NINE_HOURS_IN_MS } from './types';

export const getLastDayNight = (dates: DateInterface[]): number => {
  const timestamps = dates.map((date) => new Date(date.date).getTime());
  const maxDate = Math.max(...timestamps);
  return maxDate + 1000 * 60 * 60 * 24; // 하루를 밀리초로 변환
};

export const isValidGroup = (lastDayNight: number): boolean => {
  const now = new Date().getTime();
  return lastDayNight > now;
};

export const getFirstDay = (dates: string[]): number => {
  const timestamps = dates.map((date) => new Date(date).getTime());
  const minDate = Math.min(...timestamps);
  return minDate;
};

/**
 * @description 모임은 시작 시간으로부터 3일 이전에 생성되어야 한다.
 */
export const validateGroupDates = (
  dates: string[],
  timeZone: 'kst' | 'utc' = 'kst',
): boolean => {
  const firstDay = getFirstDay(dates);
  const now =
    timeZone === 'kst'
      ? new Date().getTime() + NINE_HOURS_IN_MS
      : new Date().getTime();
  const threeDaysInMs = 3 * 24 * 60 * 60 * 1000; // 3일을 밀리초로 변환

  // 시작 시간까지 3일 이상 남았는지 확인
  if (firstDay - now < threeDaysInMs) return false;

  return true;
};
