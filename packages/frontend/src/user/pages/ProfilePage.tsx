import { useEffect, useState } from 'react';
import { BaseLayout } from '../../common/BaseLayout';
import { useUsers } from '../hooks/useUsers';
import { GetProfileResDto } from '@rimgosu/libs';
import { BottomNavigationBar } from '../../common/components/BottomNavigationBar';
import { ProfileGroupCard } from '../components/ProfileGroupCard';
import { Cog6ToothIcon, PencilIcon } from '@heroicons/react/24/outline';

export const ProfilePage = () => {
  const { fetchProfile } = useUsers();
  const [profileData, setProfileData] = useState<GetProfileResDto | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      const res = await fetchProfile();
      if (res.data) {
        setProfileData(res.data);
      }
    };
    fetchProfileData();
  }, []);

  return (
    <BaseLayout
      title="인증하세요"
      rightElement={
        <Cog6ToothIcon className="w-6 h-6 text-gray-600 cursor-pointer" />
      }
      bottomNavBar={
        <div className="flex justify-center items-center">
          <BottomNavigationBar />
        </div>
      }
    >
      <div className="flex flex-col p-4 gap-4">
        {/* 상단 프로필 섹션 */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-4">
            <div className="text-sm ">인증머니: {profileData?.money}원</div>
            <div className="text-xl flex flex-col gap-2 justify-center items-center">
              <div>총 인증한 일수</div>
              <div className="text-3xl">{profileData?.totalProofDays}일</div>
            </div>
          </div>
          <div className="w-20 h-20 rounded-full relative">
            <img
              src={profileData?.profilePhotos[0]}
              alt="프로필"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 right-0 p-1 border border-gray-400 bg-white rounded-full shadow-md cursor-pointer">
              <PencilIcon className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* 진행 중인 인증 */}
        <div className="mt-4">
          <h2 className="font-bold mb-2">진행 중인 인증</h2>
          <div className="grid grid-cols-2 gap-4">
            {profileData?.currentGroup.map((group, index) => (
              <ProfileGroupCard
                key={index}
                days={group.proofDays}
                name={group.name}
              />
            ))}
          </div>
        </div>

        {/* 예약한 인증 */}
        <div className="mt-4">
          <h2 className="font-bold mb-2">예약한 인증</h2>
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
          <h2 className="font-bold mb-2">완료한 인증</h2>
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
