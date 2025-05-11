import { BaseLayout } from '../../common/BaseLayout';
import React, { useEffect, useState } from 'react';
import {
  EmailVerificationState,
  SignUpFormData,
  VerificationState,
} from '../types';
import { useNavigate } from 'react-router-dom';
import { AgreementSection } from '../components/Agreement';
import { Input } from '../../common/components/Input';
import { useAuth } from '../hooks/useAuth';
import { ValidationMessage } from '../../common/components/ValidationMessage';
import { GreenButton } from '../components/GreenButton';

export const SignUpPage = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    nickname: '',
    confirmPassword: '',
    password: '',
    eventAgree: false,
    requireAgree: false,
    ageAgree: false,
    termsAgree: false,
    privacyAgree: false,
    marketingAgree: false,
    smsAgree: false,
  });
  const [emailVerification, setEmailVerification] =
    useState<EmailVerificationState>({
      show: false,
      code: '',
      isVerified: false,
      timer: 180,
    });
  const [verification, setVerification] = useState<VerificationState>({
    validPassword: '',
    passwordConfirm: '',
    validNickname: '',
    validCode: '',
  });
  const navigate = useNavigate();

  const {
    sendVerificationEmail,
    verifyEmailCode,
    signUp,
    verifyPassword,
    verifyNickname,
  } = useAuth();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (
      emailVerification.show &&
      emailVerification.timer > 0 &&
      !emailVerification.isVerified
    ) {
      interval = setInterval(() => {
        setEmailVerification((prev) => ({
          ...prev,
          timer: prev.timer - 1,
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [
    emailVerification.show,
    emailVerification.timer,
    emailVerification.isVerified,
  ]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'password') {
      value &&
        verifyPassword({ password: value })
          .then(() => {
            setVerification((prev) => ({
              ...prev,
              validPassword: '',
            }));
          })
          .catch((error) => {
            setVerification((prev) => ({
              ...prev,
              validPassword: error.message,
            }));
          });
      !value &&
        setVerification((prev) => ({
          ...prev,
          validPassword: '',
        }));
    }

    if (name === 'confirmPassword') {
      value &&
        formData.password !== value &&
        setVerification((prev) => ({
          ...prev,
          passwordConfirm: '비밀번호가 일치하지 않습니다.',
        }));

      (formData.password === value || !value) &&
        setVerification((prev) => ({
          ...prev,
          passwordConfirm: '',
        }));
    }

    if (name === 'nickname') {
      value &&
        verifyNickname({ nickname: value })
          .then(() => {
            setVerification((prev) => ({
              ...prev,
              validNickname: '',
            }));
          })
          .catch((error) => {
            setVerification((prev) => ({
              ...prev,
              validNickname: error.message,
            }));
          });

      !value &&
        setVerification((prev) => ({
          ...prev,
          validNickname: '',
        }));
    }
  };

  const handleVerificationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEmailVerification((prev) => ({
      ...prev,
      code: e.target.value,
    }));
  };

  const handleEmailVerification = async () => {
    const res = await sendVerificationEmail({ email: formData.email });
    setEmailVerification((prev) => ({
      ...prev,
      show: true,
      code: '',
      isVerified: false,
      timer: 180,
    }));
    res.data && alert('이메일 인증 메일을 발송했습니다.');
    res.error && alert(res.error.message);
  };

  const handleVerifyEmailCode = async () => {
    const result = await verifyEmailCode({
      email: formData.email,
      code: emailVerification.code,
    });

    if (result?.data) {
      setVerification((prev) => ({
        ...prev,
        validCode: '',
      }));
      setEmailVerification((prev) => ({
        ...prev,
        isVerified: true,
      }));
    } else {
      setVerification((prev) => ({
        ...prev,
        validCode: '인증번호가 일치하지 않습니다.',
      }));
    }
  };

  const validateSignUpData = () => {
    if (!emailVerification.isVerified) {
      alert('이메일 인증이 필요합니다.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return false;
    }

    if (!formData.requireAgree) {
      alert('필수 약관에 동의해주세요.');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateSignUpData()) return;

    const res = await signUp(formData);
    res.data && navigate('/auth/login');
    res.error && alert(res.error.message);
  };

  return (
    <BaseLayout isMainLogo>
      <Input
        label="이메일"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        name="email"
        placeholder="이메일 입력"
        required
      />

      <div className="border border-green-300 p-4 rounded">
        <button className="text-green-500" onClick={handleEmailVerification}>
          이메일 인증하기
        </button>
      </div>

      {emailVerification.show && (
        <div
          className={`mt-4 border border-gray-300 rounded p-4 ${
            emailVerification.isVerified && 'bg-gray-100'
          }`}
        >
          <p className="text-sm text-gray-600 mb-2">
            이메일로 받은 인증 코드를 입력해주세요
          </p>
          <p className="text-sm text-gray-600 mb-2">
            인증 코드가 도착하지 않았다면 스팸 메일함을 확인해주세요
          </p>
          <div className="flex items-center gap-2 border border-gray-300 rounded p-2">
            <input
              type="text"
              className={`p-2 flex-1 outline-none ${emailVerification.isVerified && 'text-gray-400'}`}
              placeholder="인증번호확인"
              value={emailVerification.code}
              onChange={handleVerificationCodeChange}
              disabled={emailVerification.isVerified}
            />
            <span
              className={
                emailVerification.isVerified ? 'text-gray-400' : 'text-red-500'
              }
            >
              {formatTime(emailVerification.timer)}
            </span>
            <button
              className={'px-4 py-2 rounded text-gray-400'}
              onClick={handleVerifyEmailCode}
              disabled={emailVerification.isVerified}
            >
              {emailVerification.isVerified ? '인증완료' : '확인'}
            </button>
          </div>
          <div className="mt-4">
            <ValidationMessage message={verification.validCode} />
          </div>
        </div>
      )}

      <Input
        label="닉네임"
        type="text"
        value={formData.nickname}
        onChange={handleInputChange}
        name="nickname"
        placeholder="닉네임 입력"
        required
      />

      <ValidationMessage message={verification.validNickname} />

      <Input
        label="비밀번호"
        type="password"
        value={formData.password}
        onChange={handleInputChange}
        name="password"
        placeholder="패스워드 입력"
        required
      />

      <ValidationMessage message={verification.validPassword} />

      <Input
        label="비밀번호 확인"
        type="password"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        name="confirmPassword"
        placeholder="비밀번호 확인"
        required
      />

      <ValidationMessage message={verification.passwordConfirm} />

      <AgreementSection formData={formData} onChange={handleInputChange} />

      <GreenButton
        text="회원가입"
        onClick={handleSignUp}
        disabled={!emailVerification.isVerified}
      />
    </BaseLayout>
  );
};
