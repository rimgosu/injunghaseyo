import { useCallback, useState } from 'react';
import { Api } from '@rimgosu/libs';
import { GetGroupsRes } from '@rimgosu/libs';

export const useGroups = () => {
  const [groupsData, setGroupsData] = useState<GetGroupsRes | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchGroups = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await new Api({
        baseUrl: 'http://localhost:3001',
      }).groups.groupControllerGetGroups({
        format: 'json',
      });

      setGroupsData(response.data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('그룹을 불러오는데 실패했습니다.'),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    groupsData,
    isLoading,
    error,
    fetchGroups,
  };
};
