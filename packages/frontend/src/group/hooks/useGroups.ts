import { useCallback, useState } from 'react';
import {
  CreateGroupBody,
  GetGroupsRes,
  GroupControllerCreateGroupParams,
  ValidateCreateGroupElementBody,
} from '@rimgosu/libs';
import { ApiSingleton } from '../../common/apiSingleton';

export const useGroups = () => {
  const [groupsData, setGroupsData] = useState<GetGroupsRes | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const accessToken = localStorage.getItem('accessToken');

  const validateCreateGroupElement = async (
    body: ValidateCreateGroupElementBody,
  ) => {
    const res = await ApiSingleton.getInstance()
      .groups.groupControllerValidateCreateGroupElement(body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .catch(async (res) => {
        const err = (await res.json()) as Error;
        return err.message;
      });

    return typeof res === 'string' ? res : null;
  };

  const fetchGroups = useCallback(async () => {
    try {
      const response =
        await ApiSingleton.getInstance().groups.groupControllerGetGroups({
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
    }
  }, []);

  const createGroup = async (
    params: GroupControllerCreateGroupParams,
    body: CreateGroupBody,
  ) => {
    try {
      await ApiSingleton.getInstance().groups.groupControllerCreateGroup(
        params,
        body,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : '그룹을 생성하는데 실패했습니다.',
      );
    }
  };

  return {
    groupsData,
    error,
    fetchGroups,
    createGroup,
    validateCreateGroupElement,
  };
};
