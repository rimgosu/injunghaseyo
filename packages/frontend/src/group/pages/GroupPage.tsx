import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaseLayout } from '../../common/BaseLayout';
import { SearchBar } from '../components/SearchBar';
import { GroupCard } from '../components/GroupCard';
import { useGroups } from '../hooks/useGroups';

export const GroupPage = () => {
  const navigate = useNavigate();
  const { groupsData, isLoading, error, fetchGroups } = useGroups();
  console.log('groupsData:', groupsData);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러가 발생했습니다: {error.message}</div>;
  }

  return (
    <BaseLayout>
      <div className="flex flex-col gap-4 w-full p-4">
        <SearchBar />
        <div className="flex flex-col gap-4">
          {groupsData?.groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
        <button
          onClick={() => navigate('/groups/create')}
          className="fixed bottom-4 right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg"
        >
          +
        </button>
      </div>
    </BaseLayout>
  );
};
