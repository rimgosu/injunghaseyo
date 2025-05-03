import { BaseLayout } from '../../common/BaseLayout';
import React from 'react';
import { OtherPage } from '../components/OtherPage';
import { SocialLoginHome } from '../components/SocialLoginHome';
import { Link } from 'react-router-dom';

export const InitPage = () => (
  <BaseLayout>
    <div className="text-center py-12 mb-10">
      <h1 className="text-3xl p-12">인증하세요</h1>
    </div>
    <SocialLoginHome />
    <div className="flex items-center my-10">
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="flex-shrink mx-4 text-gray-500">또는</span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
    <div className="w-full">
      <Link to="/auth/login" className="block">
        <button className="text-left w-full border px-4 py-3 border-gray-300 rounded-xl">
          <h2 className="text-l">이메일로 로그인</h2>
        </button>
      </Link>
    </div>
    <div className="my-2">
      <OtherPage />
    </div>
  </BaseLayout>
);
