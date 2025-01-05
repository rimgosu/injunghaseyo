import {
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import { InitPage } from "./pages/InitPage";
import { SignUpPage } from "./pages/SignUpPage";
import { LoginPage } from "./pages/LoginPage";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";
import { GetCheckSignInUserStatusEnum } from "@rimgosu/libs";
import { CharacterSelectPage } from "./pages/CharacterSelectPage";
import { OauthPendingPage } from "./pages/OauthPendingPage";

export const AuthRoutes = () => {
  const { checkSignIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const accessToken = searchParams.get("accessToken");

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      navigate(location.pathname, { replace: true });
    }

    const checkAuthStatus = async () => {
      const res = await checkSignIn();

      if (res?.userStatus === GetCheckSignInUserStatusEnum.OAUTH_PENDING) {
        navigate("/auth/oauth-pending");
        return;
      } else if (
        res?.userStatus === GetCheckSignInUserStatusEnum.CHARACTER_CHOOSE
      ) {
        navigate("/auth/select-character");
        return;
      }

      const publicPaths = ["/auth/init", "/auth/login", "/auth/signup"];
      if (!publicPaths.includes(window.location.pathname)) {
        navigate("/", { replace: true });
      }
    };

    checkAuthStatus();
  }, [navigate, checkSignIn, location]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/init" replace />} />
      <Route path="/auth" element={<Navigate to="/auth/init" replace />} />
      <Route path="/auth">
        <Route path="init" element={<InitPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route
          path="search-password"
          element={<AuthLayout>비밀번호 찾기</AuthLayout>}
        />
        <Route path="oauth-pending" element={<OauthPendingPage />} />
        <Route path="select-character" element={<CharacterSelectPage />} />
      </Route>
    </Routes>
  );
};
