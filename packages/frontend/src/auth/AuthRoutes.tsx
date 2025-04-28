import { Route, Routes } from 'react-router-dom';
import { InitPage } from './pages/InitPage';
import { SignUpPage } from './pages/SignUpPage';
import { LoginPage } from './pages/LoginPage';
import { CharacterSelectPage } from './pages/CharacterSelectPage';
import { OauthPendingPage } from './pages/OauthPendingPage';
import { PrivateRoute } from '../common/PrivateRoute';
import { ChangePasswordPage } from '../setting/ChangePasswordPage';
import { FindPasswordPage } from './pages/FindPasswordPage';

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<InitPage />} />
      <Route path="init" element={<InitPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignUpPage />} />
      <Route path="find-password" element={<FindPasswordPage />} />
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
