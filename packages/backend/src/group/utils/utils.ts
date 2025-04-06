import { DateInterface, NINE_HOURS_IN_MS } from './types';

/**
 * @description fromMin - toMin 사이에 현재 시간이 포함되는 지 확인
 * 자정을 걸치는 시간대도 처리 (예: 21:00 - 03:00)
 */
export const isBetweenMinutes = (
  fromMin: number,
  toMin: number,
  timeZone: 'kst' | 'utc' = 'kst',
): boolean => {
  const currentMinute = getCurrentMinute(timeZone);

  // 자정을 걸치지 않는 일반적인 경우
  if (fromMin <= toMin) {
    return currentMinute >= fromMin && currentMinute <= toMin;
  }

  // 자정을 걸치는 경우 (예: 21:00 - 03:00)
  return currentMinute >= fromMin || currentMinute <= toMin;
};

/**
 * @description 현재 시간을 0 - 1440으로 표현
 */
export const getCurrentMinute = (timeZone: 'kst' | 'utc' = 'kst'): number => {
  const now = new Date();

  const date =
    timeZone === 'kst'
      ? new Date(now.getTime() + 9 * 60 * 60 * 1000) // KST (UTC+9)
      : now;

  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  return hours * 60 + minutes;
};

/**
 * @description 현재 시간을 YYYY-MM-DD 형식으로 변환
 * @returns YYYY-MM-DD
 */
export const getToday = (timeZone: 'kst' | 'utc' = 'kst'): string => {
  const now =
    timeZone === 'kst'
      ? new Date().getTime() + NINE_HOURS_IN_MS
      : new Date().getTime();
  return new Date(now).toISOString().split('T')[0];
};

export const getLastDayNight = (dates: DateInterface[]): number => {
  const timestamps = dates.map((date) => new Date(date.date).getTime());
  const maxDate = Math.max(...timestamps);
  return maxDate + 1000 * 60 * 60 * 24; // 하루를 밀리초로 변환
};

export const isValidGroup = (lastDayNight: number): boolean => {
  const now = new Date().getTime();
  return lastDayNight > now;
};

/**
 * @description 모임 시작 시간 조회
 * @param dates 모임 날짜
 * @returns timestamp
 */
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

/**
 * @description 환불 가능 여부 확인 (KST)
 *
 * - 모임 시작 24시간 전까지 환불 가능
 * - 모임 시작 24시간 전 이후 환불 불가능
 * - 참여 후 1시간 이내 환불 가능
 */
export const canRefund = (
  joinDate: Date,
  dates: string[],
  timeZone: 'kst' | 'utc' = 'kst',
): boolean => {
  const firstDayTimestamp = getFirstDay(dates);
  const now =
    timeZone === 'kst'
      ? new Date().getTime() + NINE_HOURS_IN_MS
      : new Date().getTime();

  if (firstDayTimestamp - now >= 1000 * 60 * 60 * 24) return true;
  if (now - joinDate.getTime() <= 1000 * 60 * 60) return true;

  return false;
};
