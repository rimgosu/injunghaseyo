import { Route, Routes, Navigate } from 'react-router-dom';
import { BaseLayout } from '../common/BaseLayout';
import { InitPage } from './pages/InitPage';
import { SignUpPage } from './pages/SignUpPage';
import { LoginPage } from './pages/LoginPage';
import { CharacterSelectPage } from './pages/CharacterSelectPage';
import { OauthPendingPage } from './pages/OauthPendingPage';
import { PrivateRoute } from '../common/PrivateRoute';
import { ChangePasswordPage } from '../user/pages/settings/ChangePasswordPage';

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/init" replace />} />
      <Route path="init" element={<InitPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignUpPage />} />
      <Route
        path="search-password"
        element={<BaseLayout>비밀번호 찾기</BaseLayout>}
      />
      <Route
        path="oauth-pending"
        element={
          <PrivateRoute>
            <OauthPendingPage />
          </PrivateRoute>
        }
      />
      <Route
        path="select-character"
        element={
          <PrivateRoute>
            <CharacterSelectPage />
          </PrivateRoute>
        }
      />
      <Route
        path="change-password"
        element={
          <PrivateRoute>
            <ChangePasswordPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};
