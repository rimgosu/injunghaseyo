// src/pages/auth/LoginPage.tsx
import { LoginLayout } from "../../layouts/LoginLayout";
import { LoginForm } from "../../components/login/LoginForm";
import { SocialLogin } from "../../components/login/SocialLogin";

export const LoginPage = () => (
  <LoginLayout>
    <div className="space-y-6">
      <LoginForm />
      <SocialLogin />
    </div>
  </LoginLayout>
);
