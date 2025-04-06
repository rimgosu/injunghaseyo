import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};
