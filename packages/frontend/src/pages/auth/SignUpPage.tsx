import { Input } from "../../components/common/Input";
import { AuthLayout } from "../../layouts/AuthLayout";
import React, { useEffect, useState } from "react";
import { AgreementSection } from "../../components/auth/Agreement";
import { SignUpFormData } from "../../types";
import axios from "axios";

export const SignUpPage = () => {
  const authState: SignUpFormData = {
    email: "",
    nickname: "",
    confirmPassword: "",
    password: "",
    eventAgree: false,
    requireAgree: false,
    ageAgree: false,
    termsAgree: false,
    privacyAgree: false,
    marketingAgree: false,
    smsAgree: false,
  };

  const [formData, setFormData] = useState(authState);
  const [showVerification, setShowVerification] = useState(false);
  const [timer, setTimer] = useState(180); // 3분 = 180초
  const [isEmailSent, setIsEmailSent] = useState(false);

  // 타이머 로직
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showVerification && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showVerification, timer]);

  // 시간 포맷팅 함수
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEmailVerification = async () => {
    try {
      console.log(process.env.REACT_APP_API_URL);
      await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/verify-email`,
        null,
        {
          params: {
            email: formData.email,
          },
        }
      );

      setIsEmailSent(true);
      setShowVerification(true);

      alert("인증 메일이 발송되었습니다. 이메일을 확인해주세요.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "이메일 발송에 실패했습니다.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col gap-4 w-full max-w-md">
        <Input
          label="이메일"
          type="email"
          value={formData.email}
          onChange={handleChange}
          name="email"
          placeholder="이메일 입력"
          required
        />

        <div className="border border-green-300 p-4 rounded">
          <button className="text-green-500" onClick={handleEmailVerification}>
            이메일 인증하기
          </button>
        </div>

        {showVerification && (
          <div className="mt-4 border border-gray-300 rounded p-4">
            <p className="text-sm text-gray-600 mb-2">
              이메일로 받은 인증 코드를 입력해주세요
            </p>
            <div className="flex items-center gap-2 border border-gray-300 rounded p-2">
              <input
                type="text"
                className="p-2 flex-1 outline-none"
                placeholder="인증번호확인"
              />
              <span className="text-red-500">{formatTime(timer)}</span>
              <button className="text-gray-500 px-4 py-2 rounded">확인</button>
            </div>
          </div>
        )}

        <Input
          label="닉네임"
          type="text"
          value={formData.nickname}
          onChange={handleChange}
          name="nickname"
          placeholder="닉네임 입력"
          required
        />

        <Input
          label="비밀번호"
          type="password"
          value={formData.password}
          onChange={handleChange}
          name="password"
          placeholder="패스워드 입력"
          required
        />

        <Input
          label="비밀번호 확인"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          name="confirmPassword"
          placeholder="패스워드 입력"
          required
        />

        <AgreementSection formData={formData} onChange={handleChange} />
      </div>
    </AuthLayout>
  );
};
