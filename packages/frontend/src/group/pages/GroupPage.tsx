import { useEffect, useState } from 'react';
import { BaseLayout } from '../../common/BaseLayout';
import { SearchBar } from '../components/SearchBar';
import { GroupCard } from '../components/GroupCard';
import { useGroups } from '../hooks/useGroups';
import { CreateButton } from '../../common/components/CreateButton';
import { BottomNavigationBar } from '../../common/components/BottomNavigationBar';
import { useAuth } from '../../auth/hooks/useAuth';

export const GroupPage = () => {
  const { groupsData, error, fetchGroups } = useGroups();
  const { checkSignIn } = useAuth();
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    const checkSignInStatus = async () => {
      const res = await checkSignIn();
      if (res) {
        setIsSignedIn(true);
      }
    };
    checkSignInStatus();
  }, [checkSignIn]);

  if (error) {
    return <div>에러가 발생했습니다: {error.message}</div>;
  }

  return (
    <BaseLayout
      bottomElement={
        <div className="flex justify-center items-center">
          <CreateButton path={isSignedIn ? '/group/create' : '/auth/login'} />
          <BottomNavigationBar />
        </div>
      }
      title="모임 목록"
    >
      <div className="flex flex-col gap-4 w-full">
        <SearchBar />
        <div className="flex flex-col gap-6">
          {groupsData?.groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      </div>
    </BaseLayout>
  );
};
