import { AuthControllerChangePasswordParams } from '@rimgosu/libs';
import { useAuth } from '../auth/hooks/useAuth';
import { BaseLayout } from '../common/BaseLayout';
import { Input } from '../common/components/Input';
import { XButton } from '../common/components/XButton';
import { useState } from 'react';
import { GreenButton } from '../auth/components/GreenButton';
import { errorMessage2String } from '../common/common.util';
import { useNavigate } from 'react-router-dom';
import { usePasswordChanged } from './stores/usePasswordChanged';

const error2humanReadable = (message: string) => {
  if (message.includes('strong enough')) {
    return '비밀번호는 특수문자, 영문, 숫자를 포함한 8자리 이상의 글자여야합니다.';
  }
  return message;
};

export const ChangePasswordPage = () => {
  const [formData, setFormData] = useState<AuthControllerChangePasswordParams>({
    password: '',
    changePassword: '',
    confirmChangePassword: '',
  });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { changePassword } = useAuth();
  const navigate = useNavigate();
  const { setPasswordChanged } = usePasswordChanged();

  const handleChangePassword = async () => {
    const res = await changePassword(formData);
    if (res.error) {
      setErrorMessage(
        error2humanReadable(errorMessage2String(res.error.message)),
      );
      return;
    }

    setPasswordChanged(true);
    navigate(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === 'Enter' &&
      formData.password &&
      formData.changePassword &&
      formData.confirmChangePassword
    ) {
      handleChangePassword();
    }
  };

  return (
    <BaseLayout title="비밀번호 변경" rightElement={<XButton />}>
      <div className="flex flex-col gap-12">
        <Input
          label="현재 비밀 번호"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          name="password"
          placeholder="패스워드 입력"
          required
          onKeyDown={handleKeyDown}
        />

        <div className="flex flex-col gap-4">
          <Input
            label="새 비밀번호"
            type="password"
            value={formData.changePassword}
            onChange={handleInputChange}
            name="changePassword"
            placeholder="패스워드 입력"
            required
            onKeyDown={handleKeyDown}
          />

          <Input
            label="새 비밀번호 확인"
            type="password"
            value={formData.confirmChangePassword}
            onChange={handleInputChange}
            name="confirmChangePassword"
            placeholder="패스워드 입력"
            required
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex flex-col gap-2">
          {errorMessage && (
            <p className="text-red-500 text-sm text-right">{errorMessage}</p>
          )}
          <GreenButton
            text="변경하기"
            onClick={handleChangePassword}
            disabled={
              !formData.password ||
              !formData.changePassword ||
              !formData.confirmChangePassword
            }
          />
        </div>
      </div>
    </BaseLayout>
  );
};
