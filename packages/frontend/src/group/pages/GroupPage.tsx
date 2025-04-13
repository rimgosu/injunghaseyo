import { useEffect, useState, useCallback } from 'react';
import { BaseLayout } from '../../common/BaseLayout';
import { SearchBar } from '../components/SearchBar';
import { GroupCard } from '../components/GroupCard';
import { useGroups } from '../hooks/useGroups';
import { CreateButton } from '../../common/components/CreateButton';
import { BottomNavigationBar } from '../../common/components/BottomNavigationBar';
import { GetGroupsRes } from '@rimgosu/libs';
import { throttle } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useCheckSignInStore } from '../../auth/stores/useCheckSignInStore';

export const GroupPage = () => {
  const { fetchGroups } = useGroups();
  const [groupsData, setGroupsData] = useState<GetGroupsRes | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const navigate = useNavigate();
  const { isSignedIn } = useCheckSignInStore();
  const fetchGroupsData = async () => {
    setIsLoading(true);
    const res = await fetchGroups({ take: 10, cursor, q: searchQuery });
    if (res.data) {
      setCursor(res.data.nextCursor);
      setGroupsData((prev) =>
        prev
          ? {
              items: Array.from(
                new Map(
                  [...prev.items, ...res.data.items].map((item) => [
                    item.id,
                    item,
                  ]),
                ).values(),
              ),
              hasNextPage: res.data.hasNextPage,
              nextCursor: res.data.nextCursor,
            }
          : res.data,
      );
    }
    setIsLoading(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setGroupsData(null);
    setCursor(undefined);
  };

  const handleScroll = useCallback(() => {
    if (isLoading || !groupsData?.hasNextPage) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollHeight - scrollTop <= clientHeight + 100) {
      fetchGroupsData();
    }
  }, [isLoading, groupsData?.hasNextPage]);

  const throttledHandleScroll = useCallback(throttle(handleScroll, 300), [
    handleScroll,
  ]);

  useEffect(() => {
    fetchGroupsData();
  }, [searchQuery]);

  useEffect(() => {
    window.addEventListener('scroll', throttledHandleScroll);
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      throttledHandleScroll.cancel();
    };
  }, [throttledHandleScroll]);

  const handleGroupClick = (groupId: number) => {
    navigate(`/group/${groupId}`);
  };

  return (
    <BaseLayout
      bottomNavBar={
        <div className="flex justify-center items-center">
          <CreateButton path={isSignedIn ? '/group/create' : '/auth/login'} />
          <BottomNavigationBar />
        </div>
      }
      title="모임 목록"
      paddingTop=""
    >
      <SearchBar onSearch={handleSearch} />
      <div className="flex flex-col gap-4 w-full pb-24 mt-2">
        <div className="flex flex-col gap-8 mt-2">
          {groupsData?.items.map((group, index) => (
            <div
              key={group.id}
              className={index === groupsData.items.length - 1 ? 'mb-24' : ''}
            >
              <GroupCard
                group={group}
                onClick={() => handleGroupClick(group.id)}
              />
            </div>
          ))}
          {isLoading && <div className="text-center">로딩 중...</div>}
        </div>
      </div>
    </BaseLayout>
  );
};
