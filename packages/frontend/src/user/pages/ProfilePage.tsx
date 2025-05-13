import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BaseLayout } from '../../common/BaseLayout';
import { useUsers } from '../hooks/useUsers';
import { BottomNavigationBar } from '../../common/components/BottomNavigationBar';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useProfileStore } from '../stores/useProfileStore';
import { GroupSection } from '../components/GroupSection';
import { ProfileSection } from '../components/ProfileSection';
import { OtherProfileSection } from '../components/OtherProfileSection';

interface ProfilePageProps {
  showCameraButton?: boolean;
  rightElement?: React.ReactNode;
  showCurrentGroups?: boolean;
  showReservedGroups?: boolean;
  showCompletedGroups?: boolean;
  isOtherProfile?: boolean;
  profileStore?: any; // 구체적인 타입은 실제 사용하는 스토어 타입으로 대체 필요
  userId?: number; // 다른 사용자의 프로필을 볼 때 사용
  isOtherProfilePhoto?: boolean;
}

export const ProfilePage = ({
  showCameraButton = true,
  rightElement = (
    <Link to="/user/setting">
      <Cog6ToothIcon className="h-6 w-6 cursor-pointer text-gray-600" />
    </Link>
  ),
  showCurrentGroups = true,
  showReservedGroups = true,
  showCompletedGroups = true,
  isOtherProfile = false,
  profileStore = useProfileStore(),
  userId,
  isOtherProfilePhoto = false,
}: ProfilePageProps) => {
  const navigate = useNavigate();
  const { fetchProfile, fetchOtherProfile, uploadProfilePhoto } = useUsers();
  const { profileData, setProfileData } = profileStore;
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      const res =
        isOtherProfile && userId
          ? await fetchOtherProfile(userId)
          : await fetchProfile();
      if (res.data) {
        setProfileData(res.data);
      }
    };
    fetchProfileData();
  }, [isOtherProfile, userId]);

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const res = await uploadProfilePhoto(file);

    if (!res.error) {
      const profileRes = await fetchProfile();
      if (profileRes.data) {
        setProfileData(profileRes.data);
        navigate('/user/profile');
      }
    }
  };

  const handleCameraClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleProfilePhotoClick = () => {
    if (isOtherProfilePhoto) {
      navigate(`/user/${userId}/profile/photo`);
    } else {
      navigate('/user/profile/photo');
    }
  };

  const navigateGroupToday = (groupId: number) => {
    navigate(`/group/${groupId}/today`);
  };

  const navigateGroupDetail = (groupId: number) => {
    navigate(`/group/${groupId}`);
  };

  return (
    <BaseLayout
      rightElement={rightElement}
      isMainLogo
      bottomNavBar={
        <div className="flex items-center justify-center">
          <BottomNavigationBar />
        </div>
      }
    >
      <div className="flex flex-col gap-12 p-4">
        {/* 상단 프로필 섹션 */}
        {isOtherProfile ? (
          <OtherProfileSection
            profileData={profileData}
            handleProfilePhotoClick={handleProfilePhotoClick}
            handlePhotoUpload={handlePhotoUpload}
            handleCameraClick={handleCameraClick}
            fileInputRef={fileInputRef}
            showCameraButton={showCameraButton}
          />
        ) : (
          <ProfileSection
            profileData={profileData}
            handleProfilePhotoClick={handleProfilePhotoClick}
            handlePhotoUpload={handlePhotoUpload}
            handleCameraClick={handleCameraClick}
            fileInputRef={fileInputRef}
            showCameraButton={showCameraButton}
          />
        )}

        {/* 그룹 섹션들 */}
        {showCurrentGroups && (
          <GroupSection
            title="진행 중인 인증"
            groups={profileData?.currentGroup ?? []}
            onGroupClick={
              isOtherProfile ? navigateGroupDetail : navigateGroupToday
            }
            gridCols={1}
            className="mt-4"
          />
        )}

        {showReservedGroups && (
          <GroupSection
            title="예약한 인증"
            groups={profileData?.reservedGroup ?? []}
            onGroupClick={navigateGroupDetail}
            className="mt-4"
          />
        )}

        {showCompletedGroups && (
          <GroupSection
            title="완료한 인증"
            groups={profileData?.completedGroup ?? []}
            onGroupClick={
              isOtherProfile ? navigateGroupDetail : navigateGroupToday
            }
            className="mb-24"
          />
        )}
      </div>
    </BaseLayout>
  );
};
