import { ProfilePhotoCircle } from './core/ProfilePhotoCircle';

interface ProfileSectionProps {
  profileData: any; // 실제 타입은 프로필 데이터 타입으로 변경 필요
  showCameraButton?: boolean;
  handleProfilePhotoClick: () => void;
  handlePhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCameraClick: (e: React.MouseEvent) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const OtherProfileSection = ({
  profileData,
  handleProfilePhotoClick,
  handlePhotoUpload,
  handleCameraClick,
  fileInputRef,
  showCameraButton = true,
}: ProfileSectionProps) => {
  return (
    <div className="grid grid-cols-10">
      <div className="col-span-6 flex gap-1 items-center flex-col">
        <ProfilePhotoCircle
          profileData={profileData}
          showCameraButton={showCameraButton}
          handleProfilePhotoClick={handleProfilePhotoClick}
          handlePhotoUpload={handlePhotoUpload}
          handleCameraClick={handleCameraClick}
          fileInputRef={fileInputRef}
        />
        <div className="text-2xl font-bold">{profileData?.nickname}</div>
        <div className="text-sm text-gray-500">{profileData?.introduction}</div>
      </div>

      {/* 인증 정보 카드 */}
      <div className="col-span-4 flex items-center justify-center">
        <div className="flex-1 p-4 text-center">
          <div className="text-gray-600 text-lg">총 인증한 일수</div>
          <div className="text-6xl text-green-400 font-bold">
            {profileData?.totalProofDays}일
          </div>
        </div>
      </div>
    </div>
  );
};
