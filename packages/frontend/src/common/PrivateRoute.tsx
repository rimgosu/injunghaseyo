import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/hooks/useAuth';
import { useEffect, useState } from 'react';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { checkSignIn } = useAuth();
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const check = async () => {
      const res = await checkSignIn();
      res.data && setIsSignedIn(true);
      res.error && setIsSignedIn(false);
    };
    check();
  }, [checkSignIn]);

  if (!isSignedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};
