import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BaseLayout } from '../../common/BaseLayout';
import { useGroups } from '../hooks/useGroups';
import { GetGroupRes, GetGroupResJoinStatusEnum } from '@rimgosu/libs';
import { BottomNavigationBar } from '../../common/components/BottomNavigationBar';
import { useAuth } from '../../auth/hooks/useAuth';
import { ProofMethodCard } from '../components/ProofMethodCard';
import { Tag } from '../components/Tag';

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
  const { getGroup } = useGroups();
  const { checkSignIn } = useAuth();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [groupData, setGroupData] = useState<GetGroupRes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const checkSignInStatus = async () => {
      const res = await checkSignIn();

      if (!res.error) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    };
    checkSignInStatus();
  }, [checkSignIn]);

  const handleJoinGroup = () => {
    if (!isSignedIn) {
      navigate('/auth/login');
      return;
    }

    // 모임 참여 로직 구현 필요
    navigate(`/group/${groupId}/join`);
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
    <BaseLayout title="모임 상세" bottomNavBar={<BottomNavigationBar />}>
      <div className="flex flex-col gap-4 w-full pb-24">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">{groupData.title}</h2>
          <button onClick={() => navigate(-1)} className="text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <p className="text-gray-600">{groupData.description}</p>

        <div className="grid grid-cols-2 gap-4 bg-green-100 border-green-300 border rounded-xl p-4 mb-6">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-500">가격</span>
            <span className="text-lg font-semibold text-gray-800">
              {groupData.price.toLocaleString()}원
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-500">모임 개최일</span>
            <span className="text-lg font-semibold text-gray-800">
              {new Date(groupData.startDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-500">종료일</span>
            <span className="text-lg font-semibold text-gray-800">
              {new Date(groupData.endDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-500">참여 인원</span>
            <span className="text-lg font-semibold text-gray-800">
              {groupData.participants.length}명
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {groupData.tags.map((tag) => (
            <Tag tag={tag} />
          ))}
        </div>

        <div className="mb-4">
          <h3 className="font-bold mb-2">인증 방법</h3>
          <div className="space-y-2">
            {groupData.proofMethods.map((method) => (
              <ProofMethodCard key={method.contents} proofMethod={method} />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <h3 className="font-bold w-full mb-2">참여자</h3>
          <div className="flex flex-wrap gap-2">
            {groupData.participants.map((participant) => (
              <div
                key={participant.id}
                className="w-10 h-10 rounded-full overflow-hidden"
              >
                <img
                  src={participant.profilePhoto}
                  alt="프로필"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          {remainingDays > 0 && (
            <p className="text-2xl flex justify-center items-center text-center text-green-600 font-bold my-16">
              시작까지 {remainingDays}일
            </p>
          )}

          <button
            onClick={handleJoinGroup}
            disabled={
              groupData.joinStatus !== GetGroupResJoinStatusEnum.NOT_JOINED
            }
            className={`mb-8 w-full py-3 rounded-lg ${
              groupData.joinStatus === GetGroupResJoinStatusEnum.NOT_JOINED
                ? 'bg-green-500 text-white'
                : 'bg-gray-300 text-gray-600'
            }`}
          >
            {getJoinStatusMessage(groupData.joinStatus)}
          </button>
        </div>
      </div>
    </BaseLayout>
  );
};
