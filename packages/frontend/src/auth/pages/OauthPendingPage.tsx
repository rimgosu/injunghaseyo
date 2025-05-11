import React, { useState } from 'react';
import { BaseLayout } from '../../common/BaseLayout';
import { Input } from '../../common/components/Input';
import { AgreementSection } from '../components/Agreement';
import { GreenButton } from '../components/GreenButton';
import { ValidationMessage } from '../../common/components/ValidationMessage';
import { useAuth } from '../hooks/useAuth';
import { AuthControllerActivateOauthParams } from '@rimgosu/libs';
import { useNavigate } from 'react-router-dom';
import { errorMessage2String } from '../../common/common.util';

export const OauthPendingPage = () => {
  const { verifyNickname, activateOauth } = useAuth();
  const navigate = useNavigate();

  const [agreementData, setAgreementData] = useState({
    eventAgree: false,
    requireAgree: false,
    ageAgree: false,
    termsAgree: false,
    privacyAgree: false,
    marketingAgree: false,
    smsAgree: false,
  });

  const [nickname, setNickname] = useState<string>('');
  const [validNickname, setValidNickname] = useState<string>('');

  const handleNicknameChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      const nickname = e.target.value;
      setNickname(nickname);

      if (nickname.length < 2 || nickname.length > 10) {
        setValidNickname('닉네임은 2-10자 사이여야 합니다');
        return;
      }

      const res = await verifyNickname({ nickname });
      if (res.error) {
        setValidNickname(errorMessage2String(res.error.message));
      } else {
        setValidNickname('');
      }
    } catch (error) {
      if (error instanceof Error) {
        setValidNickname(error.message);
      } else {
        setValidNickname('닉네임 검증 중 오류가 발생했습니다');
      }
    }
  };

  const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreementData((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  const handleContinue = async () => {
    try {
      if (!agreementData.requireAgree) {
        throw new Error('필수 약관에 동의해주세요');
      }

      if (validNickname) {
        throw new Error('유효하지 않은 닉네임입니다');
      }

      const params: AuthControllerActivateOauthParams = {
        nickname,
        eventAgree: agreementData.eventAgree,
        requireAgree: agreementData.requireAgree,
      };

      await activateOauth(params);
      navigate('/auth/select-character');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <BaseLayout isMainLogo>
      <Input
        label="닉네임"
        type="text"
        value={nickname}
        name="닉네임"
        onChange={handleNicknameChange}
        required
      />

      <ValidationMessage message={validNickname} />

      <AgreementSection
        formData={agreementData}
        onChange={handleAgreementChange}
      />

      <GreenButton text="계속하기" onClick={handleContinue} />
    </BaseLayout>
  );
};
