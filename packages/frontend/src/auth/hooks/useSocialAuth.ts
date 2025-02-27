import axios from 'axios';
import { useCallback } from 'react';

export const useSocialAuth = () => {
  const googleLogin = useCallback(async () => {
    try {
      window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || '구글 로그인에 실패했습니다.',
        );
      }
    }
  }, []);

  const kakaoLogin = useCallback(async () => {
    try {
      window.location.href = `${process.env.REACT_APP_API_URL}/auth/kakao`;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || '카카오 로그인에 실패했습니다.',
        );
      }
    }
  }, []);

  const naverLogin = useCallback(async () => {
    try {
      window.location.href = `${process.env.REACT_APP_API_URL}/auth/naver`;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || '네이버 로그인에 실패했습니다.',
        );
      }
    }
  }, []);

  return {
    googleLogin,
    kakaoLogin,
    naverLogin,
  };
};
