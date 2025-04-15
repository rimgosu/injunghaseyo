import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BaseLayout } from '../../common/BaseLayout';
import { useGroups } from '../hooks/useGroups';
import { GetGroupRes, GetGroupResJoinStatusEnum } from '@rimgosu/libs';
import { BottomNavigationBar } from '../../common/components/BottomNavigationBar';
import { ProofMethodCard } from '../components/ProofMethodCard';
import { Tag } from '../components/Tag';
import { useCheckSignInStore } from '../../auth/stores/useCheckSignInStore';
import { errorMessage2String } from '../../common/common.util';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { GreenButton } from '../../auth/components/GreenButton';
import { JoinModal } from '../components/JoinModal';

const getJoinStatusMessage = (status: GetGroupResJoinStatusEnum) => {
  switch (status) {
    case GetGroupResJoinStatusEnum.RESERVED:
      return '이미 예약한 모임입니다';
    case GetGroupResJoinStatusEnum.IN_PROGRESS:
      return '진행 중인 모임입니다';
    case GetGroupResJoinStatusEnum.COMPLETED:
      return '완료한 모임입니다';
    case GetGroupResJoinStatusEnum.NOT_JOINED:
      return '참여하기';
    case GetGroupResJoinStatusEnum.NOT_JOINABLE:
      return '참여가 불가능한 모임입니다';
    default:
      return '';
  }
};

// 남은 일수 계산 함수
const calculateRemainingDays = (startDate: string): number => {
  const today = new Date();
  const start = new Date(startDate);
  const diffTime = start.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const GroupDetailPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { getGroup, joinGroup } = useGroups();
  const { isSignedIn } = useCheckSignInStore();
  const [groupData, setGroupData] = useState<GetGroupRes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroupData = async () => {
      if (!groupId) return;

      setIsLoading(true);
      const res = await getGroup(parseInt(groupId));
      if (res.data) {
        setGroupData(res.data);
      }
      setIsLoading(false);
    };

    fetchGroupData();
  }, [groupId]);

  const handleJoinGroup = async () => {
    if (!isSignedIn) {
      navigate('/auth/login');
      return;
    }

    if (!groupId) return;

    const res = await joinGroup(parseInt(groupId));

    if (res.data) {
      setIsJoinModalOpen(true);
      return;
    }

    if (res.error) {
      alert(errorMessage2String(res.error.message));
      return;
    }
  };

  const handleJoinModalClose = () => {
    setIsJoinModalOpen(false);
    navigate('/user/profile');
  };

  if (isLoading) {
    return (
      <BaseLayout title="모임 상세" bottomNavBar={<BottomNavigationBar />}>
        <div className="flex justify-center items-center h-full">
          <div className="text-center">로딩 중...</div>
        </div>
      </BaseLayout>
    );
  }

  if (!groupData) {
    return (
      <BaseLayout title="모임 상세" bottomNavBar={<BottomNavigationBar />}>
        <div className="flex justify-center items-center h-full">
          <div className="text-center">모임 정보를 찾을 수 없습니다.</div>
        </div>
      </BaseLayout>
    );
  }

  const remainingDays = calculateRemainingDays(groupData.startDate);

  return (
    <BaseLayout
      title="모임 상세"
      bottomNavBar={<BottomNavigationBar />}
      paddingTop=""
      rightElement={
        <XMarkIcon className="w-6 h-6 mt-1" onClick={() => navigate(-1)} />
      }
    >
      <div className="flex flex-col gap-12 w-full pb-24">
        <img
          src={groupData.groupPhoto}
          alt="모임 사진"
          className="w-full object-cover rounded-xl"
        />
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold">{groupData.title}</h2>
            <p className="text-gray-600 text-md">{groupData.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-green-300 border rounded-xl px-4 py-8">
          <div className="flex flex-col gap-1">
            <span className="text-md text-gray-500">가격</span>
            <span className="text-xl font-semibold text-gray-800">
              {groupData.price.toLocaleString()}원
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-md text-gray-500">참여 인원</span>
            <span className="text-xl font-semibold text-gray-800">
              {groupData.participants.length}명
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-md text-gray-500">모임 개최일</span>
            <span className="text-xl font-semibold text-gray-800">
              {new Date(groupData.startDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-md text-gray-500">종료일</span>
            <span className="text-xl font-semibold text-gray-800">
              {new Date(groupData.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {groupData.tags.map((tag) => (
            <Tag tag={tag} />
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xl">인증 방법</h3>
          <div className="flex flex-col gap-2">
            {groupData.proofMethods.map((method) => (
              <ProofMethodCard key={method.contents} proofMethod={method} />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <h3 className="text-xl w-full mb-2">참여자</h3>
          <div className="flex flex-wrap gap-2">
            {groupData.participants.map((participant) => (
              <div
                key={participant.id}
                className="w-16 h-16a rounded-full overflow-hidden"
              >
                <img
                  src={participant.profilePhoto}
                  alt="프로필"
                  className="w-full h-full object-cover rounded-full border border-gray-800"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-12">
          {remainingDays > 0 && (
            <div className="flex flex-col gap-2 items-center">
              <p className="text-xl">시작까지</p>
              <p className="text-4xl text-green-400">{remainingDays}일</p>
            </div>
          )}

          <GreenButton
            text={getJoinStatusMessage(groupData.joinStatus)}
            onClick={handleJoinGroup}
            disabled={
              groupData.joinStatus !== GetGroupResJoinStatusEnum.NOT_JOINED
            }
          />
        </div>
      </div>
      <JoinModal
        isOpen={isJoinModalOpen}
        onClose={handleJoinModalClose}
        title={groupData.title}
      />
    </BaseLayout>
  );
};
