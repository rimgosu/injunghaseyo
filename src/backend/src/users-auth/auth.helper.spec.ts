import {
  generateVerificationCode,
  hashPassword,
  verifyPassword,
} from './auth.helper';

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

describe('Password Hashing Functions', () => {
  const testPassword = 'MySecurePassword123!';

  describe('hashPassword', () => {
    it('동일한 비밀번호여도 매번 다른 해시값을 생성해야 한다', async () => {
      const result1 = await hashPassword(testPassword);
      const result2 = await hashPassword(testPassword);

      expect(result1.hashedPassword).not.toBe(result2.hashedPassword);
      expect(result1.salt).not.toBe(result2.salt);
    });

    it('해시와 솔트는 16진수 형식이어야 한다', async () => {
      const result = await hashPassword(testPassword);

      expect(result.hashedPassword).toMatch(/^[0-9a-f]+$/);
      expect(result.salt).toMatch(/^[0-9a-f]+$/);
    });

    it('빈 문자열 비밀번호는 에러를 발생시켜야 한다', async () => {
      await expect(hashPassword('')).rejects.toThrow();
    });
  });

  describe('verifyPassword', () => {
    it('올바른 비밀번호는 검증에 성공해야 한다', async () => {
      const { hashedPassword, salt } = await hashPassword(testPassword);
      const isValid = await verifyPassword(testPassword, hashedPassword, salt);

      expect(isValid).toBe(true);
    });

    it('잘못된 비밀번호는 검증에 실패해야 한다', async () => {
      const { hashedPassword, salt } = await hashPassword(testPassword);
      const isValid = await verifyPassword(
        'WrongPassword123!',
        hashedPassword,
        salt,
      );

      expect(isValid).toBe(false);
    });
  });
});
