import React, { Component } from "react";
import { SocialLogin } from "../components/SocialLogin";
import { SignupForm } from "../components/SignUpForm";
import { LoginForm } from "../components/LoginForm";
import { CharacterSelect } from "../components/CharacterSelect";

interface LoginPageState {
  currentView: "login" | "signup" | "character";
}

export class LoginPage extends Component<{}, LoginPageState> {
  state: LoginPageState = {
    currentView: "login",
  };

  setCurrentView = (view: LoginPageState["currentView"]) => {
    this.setState({ currentView: view });
  };

  render() {
    const { currentView } = this.state;

    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <SocialLogin />

          {currentView === "login" && (
            <>
              <LoginForm />
              <button
                onClick={() => this.setCurrentView("signup")}
                className="mt-4 text-blue-500 hover:underline"
              >
                회원가입하기
              </button>
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

          {currentView === "character" && <CharacterSelect />}
        </div>
      </div>
    );
  }
}
