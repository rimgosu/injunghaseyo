import {
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { BaseLayout } from '../common/BaseLayout';
import { InitPage } from './pages/InitPage';
import { SignUpPage } from './pages/SignUpPage';
import { LoginPage } from './pages/LoginPage';
import { useAuth } from './hooks/useAuth';
import { useEffect } from 'react';
import { GetCheckSignInUserStatusEnum } from '@rimgosu/libs';
import { CharacterSelectPage } from './pages/CharacterSelectPage';
import { OauthPendingPage } from './pages/OauthPendingPage';
import { PrivateRoute } from '../common/PrivateRoute';

export const AuthRoutes = () => {
  const { checkSignIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const accessToken = searchParams.get('accessToken');

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      navigate(location.pathname, { replace: true });
      return;
    }
  }, [location.search, navigate]);

  useEffect(() => {
    const currentPath = location.pathname;
    const publicPaths = ['/auth/init', '/auth/login', '/auth/signup'];

    if (publicPaths.includes(currentPath)) {
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      return;
    }

    const checkAuthStatus = async () => {
      const res = await checkSignIn();

      res?.data?.userStatus === GetCheckSignInUserStatusEnum.OAUTH_PENDING &&
        navigate('/auth/oauth-pending', { replace: true });
      res?.data?.userStatus === GetCheckSignInUserStatusEnum.CHARACTER_CHOOSE &&
        navigate('/auth/select-character', { replace: true });
      res?.data?.userStatus === GetCheckSignInUserStatusEnum.ACTIVE &&
        navigate('/group', { replace: true });
    };

    checkAuthStatus();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/init" replace />} />
      <Route path="init" element={<InitPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route
        path="signup"
        element={
          <PrivateRoute>
            <SignUpPage />
          </PrivateRoute>
        }
      />
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
        element={
          <PrivateRoute>
            <CharacterSelectPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};
