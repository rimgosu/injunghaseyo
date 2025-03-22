export const transformSearchQuery = (value: string): string | number => {
  if (typeof value === 'string') {
    // 1. 모든 공백 제거
    const noSpaceValue = value.replace(/\s+/g, '');

    // 2. '원'으로 끝나는지 체크하고 다른 문자가 섞여있는지 확인
    if (noSpaceValue.endsWith('원')) {
      // 원을 제외한 나머지 문자열이 숫자로만 이루어져 있는지 확인
      const numericPart = noSpaceValue.slice(0, -1);
      if (/^\d+$/.test(numericPart)) {
        return Number(numericPart);
      }
    }

    // 3. 순수하게 숫자로만 이루어진 문자열인 경우
    if (/^\d+$/.test(noSpaceValue)) {
      return Number(noSpaceValue);
    }

    // 그 외의 경우는 문자열 그대로 반환
    return noSpaceValue;
  }
  return value;
};
