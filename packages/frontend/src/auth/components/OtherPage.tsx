import { Component, ReactNode } from "react";
import { connect } from "react-redux";
import { setView } from "../../store/auth/authSlice";
import { AuthView } from "../../store/auth/types";
import { Link } from "react-router-dom";

interface OtherPageProps {
  setView: (view: AuthView) => void;
}

class OtherPageComponent extends Component<OtherPageProps> {
  render(): ReactNode {
    return (
      <div className="">
        <div className="flex justify-end text-gray-500 py-1">
          <p className="px-1 text-gray-700">계정이 없으신가요?</p>
          <Link to="/auth/signup">회원가입</Link>
        </div>
        <div className="flex justify-end text-gray-500">
          <Link to="/auth/search-password">비밀번호 찾기</Link>
        </div>
      </div>
    );
  }
}

export const OtherPage = connect(null, { setView })(OtherPageComponent);
