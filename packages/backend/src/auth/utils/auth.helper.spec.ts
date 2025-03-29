import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AuthHelper } from './auth.helper';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('AuthHelper', () => {
  let authHelper: AuthHelper;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthHelper,
        ConfigService,
        JwtService,
        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
      ],
    }).compile();

    authHelper = moduleRef.get<AuthHelper>(AuthHelper);
  });

  describe('generateStrongPassword', () => {
    test('기본 길이는 10자리여야 함', () => {
      const password = authHelper.generateStrongPassword();
      expect(password.length).toBe(10);
    });

    test('지정한 길이로 비밀번호가 생성되어야 함', () => {
      const password = authHelper.generateStrongPassword(15);
      expect(password.length).toBe(15);
    });

    test('대문자를 최소 1개 이상 포함해야 함', () => {
      const password = authHelper.generateStrongPassword();
      expect(password).toMatch(/[A-Z]/);
    });

    test('소문자를 최소 1개 이상 포함해야 함', () => {
      const password = authHelper.generateStrongPassword();
      expect(password).toMatch(/[a-z]/);
    });

    test('숫자를 최소 1개 이상 포함해야 함', () => {
      const password = authHelper.generateStrongPassword();
      expect(password).toMatch(/[0-9]/);
    });

    test('특수문자를 최소 1개 이상 포함해야 함', () => {
      const password = authHelper.generateStrongPassword();
      expect(password).toMatch(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/);
    });

    test('연속 생성된 비밀번호는 서로 달라야 함', () => {
      const password1 = authHelper.generateStrongPassword();
      const password2 = authHelper.generateStrongPassword();
      const password3 = authHelper.generateStrongPassword();

      expect(password1).not.toBe(password2);
      expect(password2).not.toBe(password3);
      expect(password3).not.toBe(password1);
    });

    test('100개의 비밀번호를 생성했을 때 모든 요구사항을 충족해야 함', () => {
      const passwords = Array.from({ length: 100 }, () =>
        authHelper.generateStrongPassword(),
      );

      passwords.forEach((password) => {
        expect(password.length).toBe(10);
        expect(password).toMatch(/[A-Z]/); // 대문자
        expect(password).toMatch(/[a-z]/); // 소문자
        expect(password).toMatch(/[0-9]/); // 숫자
        expect(password).toMatch(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/); // 특수문자
      });

      // 모든 비밀번호가 유니크한지 검증
      const uniquePasswords = new Set(passwords);
      expect(uniquePasswords.size).toBe(passwords.length);
    });
  });

  describe('generateVerificationCode', () => {
    test('생성된 코드는 문자열이어야 함', () => {
      const code = authHelper.generateVerificationCode();
      expect(typeof code).toBe('string');
    });

    test('생성된 코드는 정확히 6자리여야 함', () => {
      const code = authHelper.generateVerificationCode();
      expect(code.length).toBe(6);
    });

    test('생성된 코드는 숫자로만 이루어져야 함', () => {
      const code = authHelper.generateVerificationCode();
      expect(/^\d+$/.test(code)).toBeTruthy();
    });
  });

  describe('Password Hashing Functions', () => {
    const testPassword = 'MySecurePassword123!';

    describe('hashPassword', () => {
      it('동일한 비밀번호여도 매번 다른 해시값을 생성해야 한다', async () => {
        const result1 = await authHelper.hashPassword(testPassword);
        const result2 = await authHelper.hashPassword(testPassword);

        expect(result1.hashedPassword).not.toBe(result2.hashedPassword);
        expect(result1.salt).not.toBe(result2.salt);
      });

      it('해시와 솔트는 16진수 형식이어야 한다', async () => {
        const result = await authHelper.hashPassword(testPassword);

        expect(result.hashedPassword).toMatch(/^[0-9a-f]+$/);
        expect(result.salt).toMatch(/^[0-9a-f]+$/);
      });

      it('빈 문자열 비밀번호는 에러를 발생시켜야 한다', async () => {
        await expect(authHelper.hashPassword('')).rejects.toThrow(
          BadRequestException,
        );
      });
    });

    describe('verifyPassword', () => {
      it('올바른 비밀번호는 검증에 성공해야 한다', async () => {
        const { hashedPassword, salt } =
          await authHelper.hashPassword(testPassword);
        const isValid = await authHelper.verifyPassword(
          testPassword,
          hashedPassword,
          salt,
        );

        expect(isValid).toBe(true);
      });

      it('잘못된 비밀번호는 검증에 실패해야 한다', async () => {
        const { hashedPassword, salt } =
          await authHelper.hashPassword(testPassword);
        const isValid = await authHelper.verifyPassword(
          'WrongPassword123!',
          hashedPassword,
          salt,
        );

        expect(isValid).toBe(false);
      });
    });
  });
});
