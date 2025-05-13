import React from 'react';
import kakaoIcon from './svgs/btn_kakao.svg';
import googleIcon from './svgs/btn_google.svg';
import naverIcon from './svgs/btn_naver.svg';
import { SocialLoginButton } from './SocialLoginButton';
import { useSocialAuth } from '../hooks/useSocialAuth';

export const SocialLoginHome = () => {
  const { googleLogin, kakaoLogin, naverLogin } = useSocialAuth();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <SocialLoginButton
          provider="google"
          icon={googleIcon}
          text="구글로 시작하기"
          className="border border-gray-300 hover:bg-gray-50"
          onClick={googleLogin}
        />
        <SocialLoginButton
          provider="kakao"
          icon={kakaoIcon}
          text="카카오로 시작하기"
          className="border border-[#FEE500] bg-[#FEE500] hover:bg-[#FDE300]"
          onClick={kakaoLogin}
        />
        <SocialLoginButton
          provider="naver"
          icon={naverIcon}
          text="네이버로 시작하기"
          className="border border-[#03C75A] bg-[#03C75A] text-white hover:bg-[#02BD54]"
          onClick={naverLogin}
        />
      </div>
    </div>
  );
};
