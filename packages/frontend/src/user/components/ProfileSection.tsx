import { CameraIcon } from '@heroicons/react/24/outline';
import { number2Won } from '../../common/common.util';

interface ProfileSectionProps {
  profileData: any; // 실제 타입은 프로필 데이터 타입으로 변경 필요
  showCameraButton?: boolean;
  isOtherProfilePhoto?: boolean;
  handleProfilePhotoClick: () => void;
  handlePhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCameraClick: (e: React.MouseEvent) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const ProfileSection = ({
  profileData,
  handleProfilePhotoClick,
  handlePhotoUpload,
  handleCameraClick,
  fileInputRef,
  showCameraButton = true,
}: ProfileSectionProps) => {
  return (
    <div className="flex items-center flex-col gap-4">
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
      <div className="text-2xl font-bold">{profileData?.nickname}</div>
      <div className="text-sm text-gray-500">{profileData?.introduction}</div>

      {/* 인증 정보 카드 */}
      <div className="w-full flex justify-between gap-4">
        <div className="flex-1 bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-gray-600 text-sm">인증머니</div>
          <div className="text-xl font-bold mt-1">
            {number2Won(profileData?.money ?? 0)}
          </div>
        </div>
        <div className="flex-1 bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-gray-600 text-sm">총 인증한 일수</div>
          <div className="text-3xl text-green-400 font-bold mt-1">
            {profileData?.totalProofDays}일
          </div>
        </div>
      </div>
    </div>
  );
};
