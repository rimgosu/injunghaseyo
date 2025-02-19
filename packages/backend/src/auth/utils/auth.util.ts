/**
 * @description 비밀번호 검증
 *
 * 1. 비밀번호 길이 검증
 * 2. 비밀번호 특수문자, 숫자, 문자 셋이 전부 포함되었는지 확인
 */
export const verifyPassword = (password: string) => {
  console.log(password);

  const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  return passwordRegex.test(password);
};
