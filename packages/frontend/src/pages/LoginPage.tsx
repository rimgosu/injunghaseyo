import { Component } from "react";
import { SocialLogin } from "../components/login/SocialLogin";
import { SignupForm } from "../components/login/SignUpForm";
import { LoginForm } from "../components/login/LoginForm";
import { CharacterSelect } from "../components/login/CharacterSelect";
import { InitInjung } from "../components/login/InitInjung";

interface LoginPageState {
  currentView:
    | "init"
    | "login"
    | "signup"
    | "search-password"
    | "oauth-pending"
    | "select-character";
}

export class LoginPage extends Component<{}, LoginPageState> {
  state: LoginPageState = {
    currentView: "init",
  };

  setCurrentView = (view: LoginPageState["currentView"]) => {
    this.setState({ currentView: view });
  };

  render() {
    const { currentView } = this.state;

    return (
      <div className="min-h-screen bg-gray-100 px-4 flex flex-col">
        <div className="flex-1 max-w-md w-full mx-auto bg-white p-6">
          {currentView === "init" && (
            <>
              <InitInjung />
            </>
          )}

          {currentView === "login" && (
            <>
              <LoginForm />
              <button
                onClick={() => this.setCurrentView("signup")}
                className="mt-4 text-blue-500 hover:underline"
              >
                회원가입하기
              </button>
              <SocialLogin />
            </>
          )}

          {currentView === "signup" && (
            <>
              <SignupForm />
              <button
                onClick={() => this.setCurrentView("login")}
                className="mt-4 text-blue-500 hover:underline"
              >
                이미 계정이 있으신가요? 로그인하기
              </button>
            </>
          )}

          {currentView === "select-character" && <CharacterSelect />}
        </div>
      </div>
    );
  }
}
