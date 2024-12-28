import React, { Component, FormEvent } from "react";
import { UserInfo } from "../types";

interface SignupState {
  formData: UserInfo;
}

export class SignupForm extends Component<{}, SignupState> {
  state: SignupState = {
    formData: {
      email: "",
      password: "",
      nickname: "",
      agreeToTerms: [false, false, false, false, false],
    },
  };

  handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("회원가입 시도:", this.state.formData);
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [name]: value,
      },
    }));
  };

  handleCheckboxChange = (index: number, checked: boolean) => {
    this.setState((prevState) => {
      const newAgreeToTerms = [...(prevState.formData.agreeToTerms || [])];
      newAgreeToTerms[index] = checked;
      return {
        formData: {
          ...prevState.formData,
          agreeToTerms: newAgreeToTerms,
        },
      };
    });
  };

  render() {
    const { formData } = this.state;
    return (
      <form onSubmit={this.handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">회원가입</h2>
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={formData.email}
          onChange={this.handleInputChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="nickname"
          placeholder="닉네임"
          value={formData.nickname}
          onChange={this.handleInputChange}
          className="p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={this.handleInputChange}
          className="p-2 border rounded"
        />

        <div className="flex flex-col gap-2">
          {[
            "이용약관 동의",
            "개인정보 수집/이용",
            "만 14세 이상입니다",
            "이벤트 알림 수신",
            "야간 이벤트 알림 수신",
          ].map((text, index) => (
            <label key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.agreeToTerms?.[index]}
                onChange={(e) =>
                  this.handleCheckboxChange(index, e.target.checked)
                }
              />
              <span>{text}</span>
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          회원 가입
        </button>
      </form>
    );
  }
}
