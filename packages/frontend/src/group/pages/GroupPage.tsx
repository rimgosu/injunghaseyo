import { useEffect, useState } from 'react';
import { BaseLayout } from '../../common/BaseLayout';
import { SearchBar } from '../components/SearchBar';
import { GroupCard } from '../components/GroupCard';
import { useGroups } from '../hooks/useGroups';
import { CreateButton } from '../../common/components/CreateButton';
import { BottomNavigationBar } from '../../common/components/BottomNavigationBar';
import { useAuth } from '../../auth/hooks/useAuth';
import { GetGroupsRes } from '@rimgosu/libs';

export const GroupPage = () => {
  const { fetchGroups } = useGroups();
  const { checkSignIn } = useAuth();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [groupsData, setGroupsData] = useState<GetGroupsRes | null>(null);

  useEffect(() => {
    const fetchGroupsData = async () => {
      const res = await fetchGroups({});
      res.data && setGroupsData(res.data);
    };
    fetchGroupsData();
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
      <div className="flex flex-col gap-4 w-full pb-24">
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
