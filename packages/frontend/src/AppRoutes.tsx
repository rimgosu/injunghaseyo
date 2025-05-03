import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import './App.css';
import './styles/globals.css';
import { AuthRoutes } from './auth/AuthRoutes';
import { GroupRoutes } from './group/GroupRoutes';
import { UserRoutes } from './user/UserRoutes';
import { useAuth } from './auth/hooks/useAuth';
import { GetCheckSignInUserStatusEnum } from '@rimgosu/libs';
import { useEffect } from 'react';
import { useCheckSignInStore } from './auth/stores/useCheckSignInStore';
import { ProofRoutes } from './proof/ProofRoutes';

export const AppRoutes = () => {
  const { checkSignIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { setCheckSignInRes, setIsSignedIn } = useCheckSignInStore();

  /**
   * @description 초기 유저의 경우 oauth-pending, select-character 페이지를 거쳐야 한다.
   */
  const asyncCheckSignIn = async () => {
    const currentPath = location.pathname;

    const publicPaths = ['/auth/init', '/auth/login'];

    if (publicPaths.includes(currentPath)) {
      return;
    }

    const res = await checkSignIn();

    if (res.data) {
      setCheckSignInRes(res.data);
      if (
        [
          GetCheckSignInUserStatusEnum.ACTIVE,
          GetCheckSignInUserStatusEnum.OAUTH_PENDING,
          GetCheckSignInUserStatusEnum.CHARACTER_CHOOSE,
        ].includes(res.data.userStatus)
      ) {
        setIsSignedIn(true);
      }

      const userStatus = res.data.userStatus;

      switch (userStatus) {
        case GetCheckSignInUserStatusEnum.OAUTH_PENDING:
          if (currentPath !== '/auth/oauth-pending') {
            navigate('/auth/oauth-pending');
          }
          return;

        case GetCheckSignInUserStatusEnum.CHARACTER_CHOOSE:
          if (currentPath !== '/auth/select-character') {
            navigate('/auth/select-character');
          }
          return;

        default:
          if (
            currentPath === '/auth/oauth-pending' ||
            currentPath === '/auth/select-character'
          ) {
            navigate('/group');
            return;
          }

          if (currentPath === '/auth') {
            navigate('/group', { replace: true });
            return;
          }
      }
    }
  };

  /**
   * @description 소셜 로그인 시 query param의 accessToken을 local storage에 저장한다.
   */
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const accessToken = searchParams.get('accessToken');

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    asyncCheckSignIn();
  }, [location.search, navigate]);

  useEffect(() => {
    asyncCheckSignIn();
  }, [location.pathname]);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      asyncCheckSignIn();
    }
  }, []);

  return (
    <Routes>
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route path="/group/*" element={<GroupRoutes />} />
      <Route path="/user/*" element={<UserRoutes />} />
      <Route path="/proof/*" element={<ProofRoutes />} />
      <Route path="/" element={<Navigate to="/group" replace />} />
    </Routes>
  );
};
