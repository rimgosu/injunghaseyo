import { DateInterface } from './types';

export const getLastDayNight = (dates: DateInterface[]): number => {
  const timestamps = dates.map((date) => new Date(date.date).getTime());
  const maxDate = Math.max(...timestamps);
  return maxDate + 1000 * 60 * 60 * 24; // 하루를 밀리초로 변환
};

export const isValidGroup = (lastDayNight: number): boolean => {
  const now = new Date().getTime();
  return lastDayNight > now;
};
