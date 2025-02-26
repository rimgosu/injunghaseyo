import { BaseLayout } from '../../common/BaseLayout';
import React, { useState } from 'react';
import { LoginFormData } from '../types';
import { Input } from '../../common/Input';
import { GreenButton } from '../components/GreenButton';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { GetCheckSignInUserStatusEnum } from '@rimgosu/libs';
import { SocialLogin } from '../components/SocialLogin';
import { OtherPage } from '../components/OtherPage';

export const LoginPage = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const { login, checkSignIn } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const result = await login(formData);
    if (result) {
      localStorage.setItem('accessToken', result.accessToken);
      const checkSignInRes = await checkSignIn();
      if (
        checkSignInRes?.userStatus ===
        GetCheckSignInUserStatusEnum.CHARACTER_CHOOSE
      ) {
        navigate('/auth/select-character');
        return;
      }

      navigate('/');
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
      />

      <Input
        label="비밀번호"
        type="password"
        value={formData.password}
        onChange={handleInputChange}
        name="password"
        placeholder="패스워드 입력"
        required
      />

      <GreenButton
        text="로그인"
        onClick={handleLogin}
        disabled={!formData.email || !formData.password}
      />

      <div className="mt-4 flex justify-end">
        <SocialLogin />
      </div>

      <OtherPage />
    </BaseLayout>
  );
};
