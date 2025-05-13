import { BaseLayout } from '../../common/BaseLayout';
import React from 'react';
import { OtherPage } from '../components/OtherPage';
import { SocialLoginHome } from '../components/SocialLoginHome';
import { Link } from 'react-router-dom';

export const InitPage = () => (
  <BaseLayout>
    <div className="mb-10 py-12 text-center">
      <h1 className="p-12 text-3xl">인증하세요</h1>
    </div>
    <SocialLoginHome />
    <div className="my-10 flex items-center">
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="mx-4 flex-shrink text-gray-500">또는</span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
    <div className="w-full">
      <Link to="/auth/login" className="block">
        <button className="w-full rounded-xl border border-gray-300 px-4 py-3 text-left">
          <h2 className="text-l">이메일로 로그인</h2>
        </button>
      </Link>
    </div>
    <div className="my-2">
      <OtherPage />
    </div>
  </BaseLayout>
);
