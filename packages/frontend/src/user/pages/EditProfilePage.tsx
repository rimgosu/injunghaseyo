import { useEffect, useState } from 'react';
import { GreenButton } from '../../auth/components/GreenButton';
import { BaseLayout } from '../../common/BaseLayout';
import { useUsers } from '../hooks/useUsers';
import { Textarea } from '../../common/components/Textarea';
import { useNavigate } from 'react-router-dom';

export const EditProfilePage = () => {
  const { fetchProfile, editProfile } = useUsers();
  const [introduction, setIntroduction] = useState('');
  const navigate = useNavigate();

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
    >
      <div className="flex flex-col gap-4">
        <Textarea
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
