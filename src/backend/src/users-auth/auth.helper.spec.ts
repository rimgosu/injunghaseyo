import { generateVerificationCode } from './auth.helper';

describe('generateVerificationCode', () => {
  test('생성된 코드는 문자열이어야 함', () => {
    const code = generateVerificationCode();
    expect(typeof code).toBe('string');
  });

  test('생성된 코드는 정확히 6자리여야 함', () => {
    const code = generateVerificationCode();
    expect(code.length).toBe(6);
  });

  test('생성된 코드는 숫자로만 이루어져야 함', () => {
    const code = generateVerificationCode();
    expect(/^\d+$/.test(code)).toBeTruthy();
  });
});
