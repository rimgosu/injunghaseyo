import { useOtherProfileStore } from '../stores/useOtherProfileStore';
import { ProfilePhotoPage } from './ProfilePhotoPage';

export const OtherProfilePhotoPage = () => {
  return (
    <ProfilePhotoPage
      profileStore={useOtherProfileStore()}
      existDeleteButton={false}
    />
  );
};
