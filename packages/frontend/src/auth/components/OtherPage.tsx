import React from 'react';
import { Link } from 'react-router-dom';

export const OtherPage = () => {
  return (
    <div className="">
      <div className="flex justify-end py-1 text-gray-500">
        <p className="px-1 text-gray-700">계정이 없으신가요?</p>
        <Link to="/auth/signup">회원가입</Link>
      </div>
      <div className="flex justify-end text-gray-500">
        <Link to="/auth/find-password">비밀번호 찾기</Link>
      </div>
    </div>
  );
};
