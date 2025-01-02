import { Input } from "../../components/common/Input";
import { AuthLayout } from "../../layouts/AuthLayout";
import React, { useState } from "react";
import { AgreementSection } from "../../components/auth/Agreement";
import { SignUpFormData } from "../../types";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
          <button className="text-green-500">이메일 인증하기</button>
        </div>

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
