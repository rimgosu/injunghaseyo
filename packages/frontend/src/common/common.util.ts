export const number2Won = (number: number): string => {
  return new Intl.NumberFormat('ko-KR').format(number) + '원';
};

export const errorMessage2String = (
  errorMessage: string | string[],
): string => {
  return Array.isArray(errorMessage) ? errorMessage[0] : errorMessage;
};
