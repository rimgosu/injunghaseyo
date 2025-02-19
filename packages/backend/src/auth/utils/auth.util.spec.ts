import { verifyPassword } from './auth.util';

describe('verifyPassword', () => {
  it('유효한 비밀번호는 true를 반환해야 합니다', () => {
    const validPasswords = [
      'Test123!@',
      'Password123$',
      'Complex123&',
      'AbCd123!@#',
      'injung123!@#',
    ];

    validPasswords.forEach((password) => {
      expect(verifyPassword(password)).toBeTruthy();
    });
  });

  it('특수문자가 없는 비밀번호는 false를 반환해야 합니다', () => {
    const password = 'Password123';
    expect(verifyPassword(password)).toBeFalsy();
  });

  it('숫자가 없는 비밀번호는 false를 반환해야 합니다', () => {
    const password = 'password@!';
    expect(verifyPassword(password)).toBeFalsy();
  });

  it('문자가 없는 비밀번호는 false를 반환해야 합니다', () => {
    const password = '123456!@';
    expect(verifyPassword(password)).toBeFalsy();
  });

  it('8자 미만의 비밀번호는 false를 반환해야 합니다', () => {
    const password = 'Pw1!';
    expect(verifyPassword(password)).toBeFalsy();
  });
});
