import { Component } from "react";
import { connect } from "react-redux";
import { RootState } from "../store";
import { InitInjung } from "../components/login/InitInjung";
import { LoginForm } from "../components/login/LoginForm";
import { SocialLogin } from "../components/login/SocialLogin";
import { AuthView } from "../store/auth/types";
import { SignupForm } from "../components/login/SignUpForm";

interface LoginPageProps {
  currentView: AuthView;
}

class LoginPageComponent extends Component<LoginPageProps> {
  render() {
    const { currentView } = this.props;

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="min-h-screen w-full max-w-xl bg-white flex">
          {currentView === "init" && <InitInjung />}
          {currentView === "login" && (
            <div className="space-y-6">
              <LoginForm />
              <SocialLogin />
            </div>
          )}
          {currentView === "signup" && <SignupForm />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  currentView: state.auth.currentView,
});

export const LoginPage = connect(mapStateToProps)(LoginPageComponent);
