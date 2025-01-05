import axios from "axios";
import { LoginFormData, SignUpFormData } from "../types";
import {
  AuthControllerVerifyCodeParams,
  AuthControllerVerifyEmailParams,
  AuthControllerVerifyNicknameParams,
  AuthControllerVerifyPasswordParams,
} from "@rimgosu/libs";

export const useAuth = () => {
  const sendVerificationEmail = async (
    params: AuthControllerVerifyEmailParams
  ) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/verify-email`,
        null,
        { params }
      );
      return {
        success: true,
        message: "인증 메일이 발송되었습니다. 이메일을 확인해주세요.",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "이메일 발송에 실패했습니다."
        );
      }
    }
  };

  const verifyEmailCode = async (params: AuthControllerVerifyCodeParams) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/verify-code`,
        null,
        { params }
      );
      return { success: true, message: "이메일 인증이 완료되었습니다." };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "인증번호 확인에 실패했습니다."
        );
      }
    }
  };

  const signUp = async (formData: SignUpFormData) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/sign-up`, null, {
        params: {
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          nickname: formData.nickname,
          requireAgree: formData.requireAgree,
          eventAgree: formData.eventAgree,
        },
      });
      return { success: true, message: "회원가입이 완료되었습니다." };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "회원가입에 실패했습니다."
        );
      }
    }
  };

  const verifyPassword = async (params: AuthControllerVerifyPasswordParams) => {
    try {
      await axios.get(`${process.env.REACT_APP_API_URL}/auth/verify-password`, {
        params,
      });
      return { success: true, message: "비밀번호 검증이 완료되었습니다." };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          "비밀번호는 특수문자, 문자, 숫자를 포함한 8자 이상이어야 합니다."
        );
      }
      return {
        success: false,
        message:
          "비밀번호는 특수문자, 문자, 숫자를 포함한 8자 이상이어야 합니다.",
      };
    }
  };

  const verifyNickname = async (params: AuthControllerVerifyNicknameParams) => {
    try {
      await axios.get(`${process.env.REACT_APP_API_URL}/auth/verify-nickname`, {
        params,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "닉네임 중복");
      }
      return {
        success: false,
        message: "닉네임 중복",
      };
    }
  };

  const login = async (formData: LoginFormData) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/sign-in`, null, {
        params: {
          email: formData.email,
          password: formData.password,
        },
      });
      return { success: true, message: "로그인이 완료되었습니다." };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "로그인에 실패했습니다."
        );
      }
    }
  };

  return {
    sendVerificationEmail,
    verifyEmailCode,
    signUp,
    verifyPassword,
    verifyNickname,
    login,
  };
};
