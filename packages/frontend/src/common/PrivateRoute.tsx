import { Navigate } from 'react-router-dom';
import { useCheckSignInStore } from '../auth/stores/useCheckSignInStore';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isSignedIn } = useCheckSignInStore();

  if (!isSignedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};
