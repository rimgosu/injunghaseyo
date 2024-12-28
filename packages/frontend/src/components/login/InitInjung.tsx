import { Component } from "react";
import { SocialLogin } from "./SocialLogin";

export class InitInjung extends Component {
  render() {
    return (
      <div>
        <div className="text-center">
          <h1 className="text-2xl">인증하세요</h1>
        </div>
        <button>이메일로 로그인</button>
        <SocialLogin />
      </div>
    );
  }
}
