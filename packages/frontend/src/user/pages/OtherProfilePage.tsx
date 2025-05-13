import { useNavigate, useParams } from 'react-router-dom';
import { ProfilePage } from './ProfilePage';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useOtherProfileStore } from '../stores/useOtherProfileStore';

export const OtherProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <ProfilePage
      showCameraButton={false}
      userId={Number(userId)}
      rightElement={
        <XMarkIcon
          className="h-6 w-6 cursor-pointer text-gray-600"
          onClick={handleClose}
        />
      }
      showReservedGroups={false}
      isOtherProfile={true}
      profileStore={useOtherProfileStore()}
      isOtherProfilePhoto={true}
    />
  );
};
