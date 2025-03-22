import { transformSearchQuery } from './transform-search-query.util';

describe('transformSearchQuery', () => {
  it('숫자로 끝나는 문자열을 숫자로 변환해야 한다', () => {
    expect(transformSearchQuery('30000')).toBe(30000);
  });

  it('"원"으로 끝나는 숫자 문자열을 숫자로 변환해야 한다', () => {
    expect(transformSearchQuery('30000원')).toBe(30000);
  });

  it('공백이 있는 숫자 문자열을 숫자로 변환해야 한다', () => {
    expect(transformSearchQuery('30 000')).toBe(30000);
  });

  it('공백이 있는 "원" 단위 문자열을 숫자로 변환해야 한다', () => {
    expect(transformSearchQuery('30 000원')).toBe(30000);
  });

  it('일반 문자열은 그대로 반환해야 한다', () => {
    expect(transformSearchQuery('헬스')).toBe('헬스');
    expect(transformSearchQuery('코딩')).toBe('코딩');
    expect(transformSearchQuery('인증사진')).toBe('인증사진');
  });

  it('숫자와 문자가 섞인 문자열은 그대로 반환해야 한다', () => {
    expect(transformSearchQuery('30000회')).toBe('30000회');
    expect(transformSearchQuery('월30000')).toBe('월30000');
  });

  it('숫자가 아닌 값으로 끝나는 "원" 문자열은 그대로 반환해야 한다', () => {
    expect(transformSearchQuery('삼만원')).toBe('삼만원');
  });
});
