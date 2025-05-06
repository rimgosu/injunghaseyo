import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export const number2Won = (number: number): string => {
  return new Intl.NumberFormat('ko-KR').format(number) + '원';
};

export const errorMessage2String = (
  errorMessage: string | string[],
): string => {
  return Array.isArray(errorMessage) ? errorMessage[0] : errorMessage;
};

export const ymd2Human = (ymd: string): string => {
  const [, month, day] = ymd.split('-');
  const monthInt = +month;
  const dayInt = +day;
  return `${monthInt}월 ${dayInt}일`;
};

export const getRelativeTime = (date: string): string => {
  return formatDistanceToNow(new Date(date), {
    locale: ko,
  });
};
