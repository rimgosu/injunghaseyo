import { Route, Routes, Navigate } from "react-router-dom";
import { LoginLayout } from "../layouts/LoginLayout";
import { InitInjung } from "../components/login/InitInjung";
import { LoginPage } from "../pages/auth/LoginPage";

export const AuthRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/auth/init" replace />} />
    <Route path="/auth">
      <Route
        path="init"
        element={
          <LoginLayout>
            <InitInjung />
          </LoginLayout>
        }
      />
      <Route path="login" element={<LoginPage />} />
      {/* <Route path="signup" element={<SignupPage />} /> */}
      <Route
        path="search-password"
        element={<LoginLayout>비밀번호 찾기 컴포넌트</LoginLayout>}
      />
      <Route
        path="oauth-pending"
        element={<LoginLayout>OAuth 처리중 컴포넌트</LoginLayout>}
      />
      <Route
        path="select-character"
        element={<LoginLayout>캐릭터 선택 컴포넌트</LoginLayout>}
      />
    </Route>
  </Routes>
);
