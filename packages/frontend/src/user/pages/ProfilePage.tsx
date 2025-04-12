import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaseLayout } from '../../common/BaseLayout';
import { useUsers } from '../hooks/useUsers';
import { BottomNavigationBar } from '../../common/components/BottomNavigationBar';
import { ProfileGroupCard } from '../components/ProfileGroupCard';
import { CameraIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useProfileStore } from '../stores/useProfileStore';
import { number2Won } from '../../common/common.util';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { fetchProfile, uploadProfilePhoto } = useUsers();
  const { profileData, setProfileData } = useProfileStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      const res = await fetchProfile();
      if (res.data) {
        setProfileData(res.data);
      }
    };
    fetchProfileData();
  }, []);

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
        window.location.href = window.location.href;
      }
    }
  };

  const handleCameraClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleProfilePhotoClick = () => {
    navigate('/user/profile/photo');
  };

  const handleGroupClick = (groupId: number) => {
    navigate(`/group/${groupId}/today`);
  };

  return (
    <BaseLayout
      title="내 정보"
      rightElement={
        <Cog6ToothIcon className="w-6 h-6 text-gray-600 cursor-pointer" />
      }
      bottomNavBar={
        <div className="flex justify-center items-center">
          <BottomNavigationBar />
        </div>
      }
    >
      <div className="flex flex-col p-4 gap-12">
        {/* 상단 프로필 섹션 */}
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
            <div
              className="absolute bottom-0 right-0 p-1 border border-gray-400 bg-white rounded-full shadow-md cursor-pointer"
              onClick={handleCameraClick}
            >
              <CameraIcon className="w-7 h-7" />
            </div>
          </div>
          <div className="text-2xl font-bold">{profileData?.nickname}</div>
          <div className="text-sm text-gray-500">
            {profileData?.introduction}
          </div>

          {/* 인증 정보 카드 추가 */}
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

        {/* 진행 중인 인증 */}
        <div className="mt-4">
          <h2 className="mb-2 text-xl">진행 중인 인증</h2>
          <div className="grid grid-cols gap-4">
            {profileData?.currentGroup.map((group, index) => (
              <ProfileGroupCard
                key={index}
                days={group.proofDays}
                name={group.name}
                onClick={() => handleGroupClick(group.id)}
              />
            ))}
          </div>
        </div>

        {/* 예약한 인증 */}
        <div className="mt-4">
          <h2 className="mb-2 text-xl">예약한 인증</h2>
          <div className="grid grid-cols-2 gap-4">
            {profileData?.reservedGroup.map((group, index) => (
              <ProfileGroupCard
                key={index}
                days={group.proofDays}
                name={group.name}
              />
            ))}
          </div>
        </div>

        {/* 완료한 인증 */}
        <div className="mb-24">
          <h2 className="mb-2 text-xl">완료한 인증</h2>
          <div className="grid grid-cols-2 gap-4">
            {profileData?.completedGroup.map((group, index) => (
              <ProfileGroupCard
                key={index}
                days={group.proofDays}
                name={group.name}
              />
            ))}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};
