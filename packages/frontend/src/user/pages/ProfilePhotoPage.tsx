import { useState } from 'react';
import { BaseLayout } from '../../common/BaseLayout';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useProfileStore } from '../stores/useProfileStore';
import { useUsers } from '../hooks/useUsers';
import { XButton } from '../../common/components/XButton';

interface ProfilePhotoPageProps {
  profileStore?: any;
  existDeleteButton?: boolean;
}

export const ProfilePhotoPage = ({
  profileStore = useProfileStore(),
  existDeleteButton = true,
}: ProfilePhotoPageProps) => {
  const { profileData, setProfileData } = profileStore;
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const { deleteProfilePhoto } = useUsers();

  const handlePrevPhoto = () => {
    if (profileData?.profilePhotos && currentPhotoIndex > 0) {
      setCurrentPhotoIndex((prev) => prev - 1);
    }
  };

  const handleNextPhoto = () => {
    if (
      profileData?.profilePhotos &&
      currentPhotoIndex < profileData.profilePhotos.length - 1
    ) {
      setCurrentPhotoIndex((prev) => prev + 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNextPhoto();
    }
    if (isRightSwipe) {
      handlePrevPhoto();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleDeletePhoto = async () => {
    if (profileData?.profilePhotos?.[currentPhotoIndex]?.id) {
      const res = await deleteProfilePhoto(
        profileData.profilePhotos[currentPhotoIndex].id,
      );

      if (res.error) return;

      // 프로필 스토어 업데이트
      const updatedPhotos = [...(profileData.profilePhotos || [])];
      updatedPhotos.splice(currentPhotoIndex, 1);
      setProfileData({
        ...profileData,
        profilePhotos: updatedPhotos,
      });

      if (currentPhotoIndex === profileData.profilePhotos.length - 1) {
        setCurrentPhotoIndex((prev) => Math.max(0, prev - 1));
      }
    }
  };

  return (
    <BaseLayout
      leftElement={<XButton textColor="text-white" />}
      rightElement={
        existDeleteButton && (
          <TrashIcon
            className="h-6 w-6 cursor-pointer text-white drop-shadow-lg transition-colors hover:text-red-500"
            onClick={handleDeletePhoto}
          />
        )
      }
      padding="p-1"
      height="h-screen"
      overflowY=""
    >
      <div className="absolute left-0 right-0 top-12 p-4 text-center text-sm text-white">
        {currentPhotoIndex + 1}/{profileData?.profilePhotos?.length || 1}
      </div>
      <div className="flex h-full items-center justify-center bg-black">
        <div
          className="relative flex-1"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={profileData?.profilePhotos?.[currentPhotoIndex]?.url}
            alt="프로필 사진"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
      <div className="absolute bottom-2 left-2 right-2 flex justify-between bg-gradient-to-t from-black/30 to-transparent p-4 text-sm">
        <div
          className={`cursor-pointer text-white ${
            currentPhotoIndex === 0 ? 'opacity-50' : ''
          }`}
          onClick={handlePrevPhoto}
        >
          이전
        </div>
        <div
          className={`cursor-pointer text-white ${
            currentPhotoIndex === (profileData?.profilePhotos?.length || 1) - 1
              ? 'opacity-50'
              : ''
          }`}
          onClick={handleNextPhoto}
        >
          다음
        </div>
      </div>
    </BaseLayout>
  );
};
