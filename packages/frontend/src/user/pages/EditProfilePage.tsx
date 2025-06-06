import { useEffect, useState, useRef } from 'react';
import { GreenButton } from '../../auth/components/GreenButton';
import { BaseLayout } from '../../common/BaseLayout';
import { useUsers } from '../hooks/useUsers';
import { Textarea } from '../../common/components/Textarea';
import { useNavigate } from 'react-router-dom';
import { XButton } from '../../common/components/XButton';

export const EditProfilePage = () => {
  const { fetchProfile, editProfile } = useUsers();
  const [introduction, setIntroduction] = useState('');
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFetchProfile = async () => {
    const res = await fetchProfile();
    if (res.data) {
      setIntroduction(res.data.introduction);
    }
  };

  const handleEditProfile = async () => {
    const res = await editProfile(introduction);
    if (!res.error) {
      navigate('/user/profile');
    }
  };

  // 텍스트가 설정된 후 textarea를 맨 아래로 스크롤
  useEffect(() => {
    if (textareaRef.current && introduction) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [introduction]);

  useEffect(() => {
    handleFetchProfile();
  }, []);

  return (
    <BaseLayout
      isMainLogo
      bottomButton={
        <GreenButton
          text="수정"
          onClick={() => {
            handleEditProfile();
          }}
        />
      }
      rightElement={<XButton />}
    >
      <div className="flex flex-col gap-4">
        <Textarea
          ref={textareaRef}
          label="소개"
          value={introduction}
          name="introduction"
          onChange={(e) => {
            setIntroduction(e.target.value);
          }}
        />
      </div>
    </BaseLayout>
  );
};
