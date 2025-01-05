import { Route, Routes, Navigate } from "react-router-dom";
import { AuthLayout } from "../auth/AuthLayout";
import { InitPage } from "../auth/pages/InitPage";
import { SignUpPage } from "../auth/pages/SignUpPage";

export const AuthRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/auth/init" replace />} />
    <Route path="/auth">
      <Route path="init" element={<InitPage />} />
      <Route path="login" element={<InitPage />} />
      <Route path="signup" element={<SignUpPage />} />
      <Route
        path="search-password"
        element={<AuthLayout>비밀번호 찾기</AuthLayout>}
      />
      <Route
        path="oauth-pending"
        element={<AuthLayout>OAuth 처리중 컴포넌트</AuthLayout>}
      />
      <Route
        path="select-character"
        element={<AuthLayout>캐릭터 선택 컴포넌트</AuthLayout>}
      />
    </Route>
  </Routes>
);
