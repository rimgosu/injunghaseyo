import React, { Component } from "react";
import kakaoIcon from "./svgs/btn_kakao.svg";
import googleIcon from "./svgs/btn_google.svg";
import naverIcon from "./svgs/btn_naver.svg";

export class SocialLoginHome extends Component {
  handleSocialLogin = (provider: "google" | "kakao" | "naver") => {
    console.log(`${provider} 로그인 시도`);
  };

  render() {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <button
            onClick={() => this.handleSocialLogin("google")}
            className="flex gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 w-full"
          >
            <img src={googleIcon} alt="Google" className="w-6 h-6" />
            <span className="text-gray-700">구글로 시작하기</span>
          </button>
          <button
            onClick={() => this.handleSocialLogin("kakao")}
            className="flex gap-2 px-4 py-3 bg-[#FEE500] border border-[#FEE500] rounded-lg hover:bg-[#FDE300] w-full"
          >
            <img src={kakaoIcon} alt="Kakao" className="w-6 h-6" />
            <span className="text-[#391B1B]">카카오로 시작하기</span>
          </button>
          <button
            onClick={() => this.handleSocialLogin("naver")}
            className="flex gap-2 px-4 py-3 bg-[#03C75A] border border-[#03C75A] rounded-lg hover:bg-[#02BD54] w-full"
          >
            <img src={naverIcon} alt="Naver" className="w-6 h-6" />
            <span className="text-white">네이버로 시작하기</span>
          </button>
        </div>
      </div>
    );
  }
}
