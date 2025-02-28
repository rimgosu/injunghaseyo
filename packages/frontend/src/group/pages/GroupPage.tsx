import { useEffect } from 'react';
import { BaseLayout } from '../../common/BaseLayout';
import { SearchBar } from '../components/SearchBar';
import { GroupCard } from '../components/GroupCard';
import { useGroups } from '../hooks/useGroups';

export const GroupPage = () => {
  const { groupsData, isLoading, error, fetchGroups } = useGroups();

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
    <BaseLayout showNavigation={true} showFloatingButton={true}>
      <div className="flex flex-col gap-4 w-full p-4">
        <SearchBar />
        <div className="flex flex-col gap-4">
          {groupsData?.groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      </div>
    </BaseLayout>
  );
};
