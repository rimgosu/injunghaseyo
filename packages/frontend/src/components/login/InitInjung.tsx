import { Component } from "react";
import { SocialLogin } from "./SocialLogin";
import { OtherPage } from "./OtherPage";

export class InitInjung extends Component {
  render() {
    return (
      <div className="w-full p-12">
        <div className="text-center py-12 mb-32">
          <h1 className="text-2xl">인증하세요</h1>
        </div>
        <button className="text-center w-full border p-4 border-gray-500 rounded-xl">
          <h2 className="text-xl">이메일로 로그인</h2>
        </button>
        <div className="my-5 flex justify-end">
          <SocialLogin />
        </div>
        <div>
          <OtherPage />
        </div>
      </div>
    );
  }
}
