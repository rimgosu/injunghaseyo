import { BaseLayout } from '../../common/BaseLayout';
import React, { useState } from 'react';
import { Input } from '../../common/components/Input';
import { GreenButton } from '../components/GreenButton';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { AuthControllerSignInParams } from '@rimgosu/libs';
import { SocialLogin } from '../components/SocialLogin';
import { OtherPage } from '../components/OtherPage';
import { errorMessage2String } from '../../common/common.util';

export const LoginPage = () => {
  const [formData, setFormData] = useState<AuthControllerSignInParams>({
    email: '',
    password: '',
  });
  const [loginError, setLoginError] = useState<string>('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const res = await login(formData);
    if (res.error) {
      setLoginError(errorMessage2String(res.error.message));
      return;
    }
    res.data && localStorage.setItem('accessToken', res.data.accessToken);

    navigate('/group');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && formData.email && formData.password) {
      handleLogin();
    }
  };

  return (
    <BaseLayout>
      <Input
        label="이메일"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        name="email"
        placeholder="이메일 입력"
        required
        onKeyDown={handleKeyDown}
      />

      <Input
        label="비밀번호"
        type="password"
        value={formData.password}
        onChange={handleInputChange}
        name="password"
        placeholder="패스워드 입력"
        required
        onKeyDown={handleKeyDown}
      />

      <GreenButton
        text="로그인"
        onClick={handleLogin}
        disabled={!formData.email || !formData.password}
      />

      {loginError && <div className="text-red-500">{loginError}</div>}

      <div className="mt-4 flex justify-end">
        <SocialLogin />
      </div>

      <OtherPage />
    </BaseLayout>
  );
};
