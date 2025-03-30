import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaseLayout } from '../../common/BaseLayout';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useProfileStore } from '../stores/useProfileStore';
import { useUsers } from '../hooks/useUsers';

export const ProfilePhotoPage = () => {
  const navigate = useNavigate();
  const { profileData, setProfileData } = useProfileStore();
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
      leftElement={
        <XMarkIcon
          className="w-6 h-6 text-gray-600 cursor-pointer"
          onClick={() => navigate(-1)}
        />
      }
      padding="p-1"
    >
      <div className="p-4 text-center text-sm text-gray-600 absolute top-12 left-0 right-0">
        {currentPhotoIndex + 1}/{profileData?.profilePhotos?.length || 1}
      </div>
      <div className="flex h-full">
        <div
          className="flex-1 relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={profileData?.profilePhotos?.[currentPhotoIndex]?.url}
            alt="프로필 사진"
            className="w-full h-full object-contain"
          />
          <TrashIcon
            className="w-6 h-6 text-gray-600 cursor-pointer absolute top-4 right-4 hover:text-red-500 transition-colors drop-shadow-lg"
            onClick={handleDeletePhoto}
          />
          <div className="absolute bottom-0 left-0 right-0 flex justify-between p-4 text-sm bg-gradient-to-t from-black/30 to-transparent">
            <div
              className={`text-white cursor-pointer ${
                currentPhotoIndex === 0 ? 'opacity-50' : ''
              }`}
              onClick={handlePrevPhoto}
            >
              이전
            </div>
            <div
              className={`text-white cursor-pointer ${
                currentPhotoIndex ===
                (profileData?.profilePhotos?.length || 1) - 1
                  ? 'opacity-50'
                  : ''
              }`}
              onClick={handleNextPhoto}
            >
              다음
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};
