import { useCallback } from 'react';
import { SignUpFormData } from '../types';
import {
  AuthControllerActivateOauthParams,
  AuthControllerChangePasswordParams,
  AuthControllerSignInParams,
  AuthControllerVerifyCodeParams,
  AuthControllerVerifyEmailParams,
  AuthControllerVerifyNicknameParams,
  AuthControllerVerifyPasswordParams,
  GetCheckSignIn,
  SignInRes,
} from '@rimgosu/libs';
import { ApiSingleton } from '../../common/apiSingleton';
import { ApiErrorType, ApiResponse } from '../../common/types';

export const useAuth = () => {
  const signOut = async (): Promise<ApiResponse<any>> => {
    return await ApiSingleton.getInstance()
      .auth.authControllerSignOut()
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  const changePassword = async (
    params: AuthControllerChangePasswordParams,
  ): Promise<ApiResponse<void>> => {
    return await ApiSingleton.getInstance()
      .auth.authControllerChangePassword(params)
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  const sendVerificationEmail = async (
    params: AuthControllerVerifyEmailParams,
  ): Promise<ApiResponse<void>> => {
    return await ApiSingleton.getInstance()
      .auth.authControllerVerifyEmail(params)
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  const verifyEmailCode = async (
    params: AuthControllerVerifyCodeParams,
  ): Promise<ApiResponse<void>> => {
    return await ApiSingleton.getInstance()
      .auth.authControllerVerifyCode(params)
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  const signUp = async (
    formData: SignUpFormData,
  ): Promise<ApiResponse<void>> => {
    return await ApiSingleton.getInstance()
      .auth.authControllerSignUp({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        nickname: formData.nickname,
        requireAgree: formData.requireAgree,
        eventAgree: formData.eventAgree,
      })
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  const verifyPassword = async (
    params: AuthControllerVerifyPasswordParams,
  ): Promise<ApiResponse<void>> => {
    return await ApiSingleton.getInstance()
      .auth.authControllerVerifyPassword(params)
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  const verifyNickname = async (
    params: AuthControllerVerifyNicknameParams,
  ): Promise<ApiResponse<void>> => {
    return await ApiSingleton.getInstance()
      .auth.authControllerVerifyNickname(params)
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  const login = async (
    formData: AuthControllerSignInParams,
  ): Promise<ApiResponse<SignInRes>> => {
    return await ApiSingleton.getInstance()
      .auth.authControllerSignIn({
        email: formData.email,
        password: formData.password,
      })
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  const checkSignIn = useCallback(async (): Promise<
    ApiResponse<GetCheckSignIn>
  > => {
    return await ApiSingleton.getInstance()
      .auth.authControllerCheckSignIn()
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return {
          error: (await error.json()) as ApiErrorType,
        };
      });
  }, []);

  const activateOauth = useCallback(
    async (
      params: AuthControllerActivateOauthParams,
    ): Promise<ApiResponse<void>> => {
      return await ApiSingleton.getInstance()
        .auth.authControllerActivateOauth(params)
        .then(() => ({ data: undefined }))
        .catch(async (error: Response) => {
          return { error: (await error.json()) as ApiErrorType };
        });
    },
    [],
  );

  return {
    sendVerificationEmail,
    verifyEmailCode,
    signUp,
    verifyPassword,
    verifyNickname,
    login,
    checkSignIn,
    activateOauth,
    changePassword,
    signOut,
  };
};
