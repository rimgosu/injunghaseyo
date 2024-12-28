import React, { Component } from "react";

export class SocialLogin extends Component {
  handleSocialLogin = (provider: "google" | "kakao" | "naver") => {
    console.log(`${provider} 로그인 시도`);
  };

  render() {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">이메일로 로그인</h2>
        <div className="flex gap-2">
          <button
            onClick={() => this.handleSocialLogin("google")}
            className="flex items-center justify-center p-2 border rounded-lg w-12 h-12"
          >
            <img src="/google-icon.png" alt="Google" className="w-6 h-6" />
          </button>
          <button
            onClick={() => this.handleSocialLogin("kakao")}
            className="flex items-center justify-center p-2 border rounded-lg w-12 h-12"
          >
            <img src="/kakao-icon.png" alt="Kakao" className="w-6 h-6" />
          </button>
          <button
            onClick={() => this.handleSocialLogin("naver")}
            className="flex items-center justify-center p-2 border rounded-lg w-12 h-12"
          >
            <img src="/naver-icon.png" alt="Naver" className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }
}
