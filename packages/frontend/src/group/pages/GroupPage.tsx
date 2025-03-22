import { useEffect, useState, useCallback } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);

  const fetchGroupsData = async (cursor?: number) => {
    setIsLoading(true);
    const res = await fetchGroups({ take: 5, cursor });
    if (res.data) {
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

  const handleScroll = useCallback(() => {
    if (isLoading || !groupsData?.hasNextPage) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollHeight - scrollTop <= clientHeight + 100) {
      fetchGroupsData(groupsData.nextCursor);
    }
  }, [isLoading, groupsData?.hasNextPage, groupsData?.nextCursor]);

  const checkInitialScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    // 초기 로딩 후 컨텐츠가 화면을 채우지 못하는 경우 추가 데이터 로드
    if (scrollHeight <= clientHeight && groupsData?.hasNextPage && !isLoading) {
      fetchGroupsData(groupsData.nextCursor);
    }
  };

  useEffect(() => {
    fetchGroupsData();
  }, []);

  useEffect(() => {
    checkInitialScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, groupsData, isLoading]);

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
      bottomNavBar={
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
          {groupsData?.items.map((group, index) => (
            <div
              key={group.id}
              className={index === groupsData.items.length - 1 ? 'mb-24' : ''}
            >
              <GroupCard group={group} />
            </div>
          ))}
          {isLoading && <div className="text-center">로딩 중...</div>}
        </div>
      </div>
    </BaseLayout>
  );
};
