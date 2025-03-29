import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BaseLayout } from '../../common/BaseLayout';
import { useGroups } from '../hooks/useGroups';
import { GetGroupRes, GetGroupResJoinStatusEnum } from '@rimgosu/libs';
import { BottomNavigationBar } from '../../common/components/BottomNavigationBar';
import { useAuth } from '../../auth/hooks/useAuth';

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

  const isJoinable =
    groupData.joinStatus === GetGroupResJoinStatusEnum.NOT_JOINED;

  return (
    <BaseLayout title="모임 상세" bottomNavBar={<BottomNavigationBar />}>
      <div className="flex flex-col gap-4 w-full pb-24">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">{groupData.title}</h2>
          <button onClick={() => navigate(-1)} className="text-gray-500">
            <span>X</span>
          </button>
        </div>

        <p className="text-gray-600 mb-4">{groupData.description}</p>

        <div className="mb-4">
          <p>가격: {groupData.price.toLocaleString()}원</p>
          <p>모임 개최일: {groupData.startDate}</p>
          <p>
            기간: {new Date(groupData.startDate).toLocaleDateString()} ~{' '}
            {new Date(groupData.endDate).toLocaleDateString()}
          </p>
          <p>참여 인원: {groupData.participants.length}명</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {groupData.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-200 px-2 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mb-4">
          <h3 className="font-bold mb-2">인증 방법</h3>
          <ul className="list-disc pl-5">
            {groupData.proofMethods.map((method, index) => (
              <li key={index}>
                {method.type}: {method.contents}
                {method.fromMin !== undefined &&
                  method.toMin !== undefined &&
                  ` (${method.fromMin}분 ~ ${method.toMin}분)`}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
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

        <div className="mt-6">
          <p className="text-center text-green-600 font-bold mb-2">
            시작까지
            <span className="text-xl"> 10일</span>
          </p>

          <button
            onClick={handleJoinGroup}
            disabled={!isJoinable}
            className={`w-full py-3 rounded-lg ${
              isJoinable
                ? 'bg-green-500 text-white'
                : 'bg-gray-300 text-gray-600'
            }`}
          >
            {isJoinable ? '참여하기' : groupData.joinStatus}
          </button>
        </div>
      </div>
    </BaseLayout>
  );
};
