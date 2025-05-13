import kakaoIcon from './svgs/btn_kakao.svg';
import googleIcon from './svgs/btn_google.svg';
import naverIcon from './svgs/btn_naver.svg';
import { useSocialAuth } from '../hooks/useSocialAuth';

export const SocialLogin = () => {
  const { googleLogin, kakaoLogin, naverLogin } = useSocialAuth();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <button
          onClick={googleLogin}
          className="flex h-16 w-16 items-center justify-center rounded-lg border border-gray-300 p-2"
        >
          <img src={googleIcon} alt="Google" className="h-10 w-10 p-1" />
        </button>
        <button
          onClick={kakaoLogin}
          className="flex h-16 w-16 items-center justify-center rounded-lg border border-gray-300 p-2"
        >
          <img src={kakaoIcon} alt="Kakao" className="h-10 w-10 p-1" />
        </button>
        <button
          onClick={naverLogin}
          className="flex h-16 w-16 items-center justify-center rounded-lg border border-gray-300 p-2"
        >
          <img src={naverIcon} alt="Naver" className="h-10 w-10 p-1" />
        </button>
      </div>
    </div>
  );
};
