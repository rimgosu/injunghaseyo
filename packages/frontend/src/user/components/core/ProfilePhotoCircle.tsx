import { CameraIcon } from '@heroicons/react/24/outline';

interface ProfilePhotoCircleProps {
  profileData: any; // 실제 타입은 프로필 데이터 타입으로 변경 필요
  showCameraButton?: boolean;
  handleProfilePhotoClick: () => void;
  handlePhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCameraClick: (e: React.MouseEvent) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const ProfilePhotoCircle = ({
  profileData,
  showCameraButton,
  handleProfilePhotoClick,
  handlePhotoUpload,
  handleCameraClick,
  fileInputRef,
}: ProfilePhotoCircleProps) => {
  return (
    <div className="relative h-36 w-36 cursor-pointer rounded-full border border-gray-300">
      <img
        src={profileData?.profilePhotos?.[0]?.url}
        alt="프로필"
        className="h-full w-full rounded-full object-cover"
        onClick={handleProfilePhotoClick}
      />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handlePhotoUpload}
      />
      {showCameraButton && (
        <div
          className="absolute bottom-0 right-0 cursor-pointer rounded-full border border-gray-400 bg-white p-1 shadow-md"
          onClick={handleCameraClick}
        >
          <CameraIcon className="h-7 w-7" />
        </div>
      )}
    </div>
  );
};
