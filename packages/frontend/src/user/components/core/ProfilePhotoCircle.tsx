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
    <div className="w-36 h-36 rounded-full relative border border-gray-300 cursor-pointer">
      <img
        src={profileData?.profilePhotos?.[0]?.url}
        alt="프로필"
        className="w-full h-full object-cover rounded-full"
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
          className="absolute bottom-0 right-0 p-1 border border-gray-400 bg-white rounded-full shadow-md cursor-pointer"
          onClick={handleCameraClick}
        >
          <CameraIcon className="w-7 h-7" />
        </div>
      )}
    </div>
  );
};
