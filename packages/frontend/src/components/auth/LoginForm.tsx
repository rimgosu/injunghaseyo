import React, { Component, FormEvent } from "react";
import { UserInfo } from "../../types";

interface LoginState {
  loginData: Pick<UserInfo, "email" | "password">;
}

export class LoginForm extends Component<{}, LoginState> {
  state: LoginState = {
    loginData: {
      email: "",
      password: "",
    },
  };

  handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("로그인 시도:", this.state.loginData);
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      loginData: {
        ...prevState.loginData,
        [name]: value,
      },
    }));
  };

  render() {
    const { loginData } = this.state;
    return (
      <form onSubmit={this.handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">로그인</h2>
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={loginData.email}
          onChange={this.handleInputChange}
          className="p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={loginData.password}
          onChange={this.handleInputChange}
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          로그인
        </button>
      </form>
    );
  }
}
