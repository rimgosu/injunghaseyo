import { AuthControllerFindPasswordParams } from '@rimgosu/libs';
import { BaseLayout } from '../../common/BaseLayout';
import { Input } from '../../common/components/Input';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { GreenButton } from '../components/GreenButton';
import { ValidationMessage } from '../../common/components/ValidationMessage';
import { errorMessage2String } from '../../common/common.util';
import { useNavigate } from 'react-router-dom';
import { XButton } from '../../common/components/XButton';

const errorString2HumanReadable = (errorString: string): string => {
  if (errorString.includes('email must be an email')) {
    return '이메일 형식이 올바르지 않습니다.';
  }

  if (errorString.includes('user 또는')) {
    return '존재하지 않는 이메일입니다.';
  }

  return errorString;
};

export const FindPasswordPage = () => {
  const { findPassword } = useAuth();
  const [formData, setFormData] = useState<AuthControllerFindPasswordParams>({
    email: '',
  });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [completeMessage, setCompleteMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await findPassword(formData);
    if (res.error) {
      setErrorMessage(
        errorString2HumanReadable(errorMessage2String(res.error.message)),
      );
      return;
    }

    setCompleteMessage(
      '임시 비밀번호가 이메일로 발송되었습니다. 5분 내로 로그인해 주세요',
    );
    setErrorMessage('');
  };

  const greenButtonConfig = () => {
    return {
      greenButtonText: completeMessage
        ? '로그인 페이지로 이동'
        : '비밀번호 찾기',
      greenButtonOnClick: completeMessage
        ? () => navigate('/auth/login')
        : handleSubmit,
    };
  };

  return (
    <BaseLayout title="비밀번호 찾기" rightElement={<XButton />}>
      <div className="flex flex-col gap-12">
        <Input
          label="이메일"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          name="email"
          placeholder="이메일 입력"
          required
        />
        <div className="flex flex-col gap-2">
          <ValidationMessage message={errorMessage} />
          {completeMessage && (
            <div className="text-gray-600 text-md text-right">
              {completeMessage}
            </div>
          )}
          <GreenButton
            text={greenButtonConfig().greenButtonText}
            onClick={greenButtonConfig().greenButtonOnClick}
            disabled={!formData.email}
          />
        </div>
      </div>
    </BaseLayout>
  );
};
