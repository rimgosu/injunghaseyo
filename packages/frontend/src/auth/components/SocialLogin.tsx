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
          className="flex items-center justify-center p-2 border border-gray-300 rounded-lg w-16 h-16"
        >
          <img src={googleIcon} alt="Google" className="w-10 h-10 p-1" />
        </button>
        <button
          onClick={kakaoLogin}
          className="flex items-center justify-center p-2 border border-gray-300 rounded-lg w-16 h-16"
        >
          <img src={kakaoIcon} alt="Kakao" className="w-10 h-10 p-1" />
        </button>
        <button
          onClick={naverLogin}
          className="flex items-center justify-center p-2 border border-gray-300 rounded-lg w-16 h-16"
        >
          <img src={naverIcon} alt="Naver" className="w-10 h-10 p-1" />
        </button>
      </div>
    </div>
  );
};
