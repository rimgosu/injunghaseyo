export const number2Won = (number: number): string => {
  return new Intl.NumberFormat('ko-KR').format(number) + '원';
};
