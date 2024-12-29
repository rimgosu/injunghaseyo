import { Input } from "../../components/common/Input";
import { AuthLayout } from "../../layouts/AuthLayout";
import React, { useState } from "react";

export const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    nickname: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
          value={formData.password}
          onChange={handleChange}
          name="password"
          placeholder="패스워드 입력"
          required
        />
      </div>
    </AuthLayout>
  );
};
