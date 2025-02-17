import {
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { InitPage } from './pages/InitPage';
import { SignUpPage } from './pages/SignUpPage';
import { LoginPage } from './pages/LoginPage';
import { useAuth } from './hooks/useAuth';
import { useEffect } from 'react';
import { GetCheckSignInUserStatusEnum } from '@rimgosu/libs';
import { CharacterSelectPage } from './pages/CharacterSelectPage';
import { OauthPendingPage } from './pages/OauthPendingPage';

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
      try {
        const res = await checkSignIn();

        if (res?.userStatus === GetCheckSignInUserStatusEnum.OAUTH_PENDING) {
          navigate('/auth/oauth-pending', { replace: true });
        } else if (
          res?.userStatus === GetCheckSignInUserStatusEnum.CHARACTER_CHOOSE
        ) {
          navigate('/auth/select-character', { replace: true });
        } else if (!publicPaths.includes(currentPath)) {
          navigate('/group', { replace: true });
        }
      } catch (error) {
        console.error('인증 상태 확인 실패:', error);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/init" replace />} />
      <Route path="init" element={<InitPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignUpPage />} />
      <Route
        path="search-password"
        element={<AuthLayout>비밀번호 찾기</AuthLayout>}
      />
      <Route path="oauth-pending" element={<OauthPendingPage />} />
      <Route path="select-character" element={<CharacterSelectPage />} />
    </Routes>
  );
};
