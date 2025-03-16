import {
  CreateGroupBody,
  GetGroupsRes,
  GroupControllerCreateGroupParams,
  ValidateCreateGroupElementBody,
} from '@rimgosu/libs';
import { ApiSingleton } from '../../common/apiSingleton';
import { ApiErrorType, ApiResponse } from '../../common/types';
import { useCallback } from 'react';

export const useGroups = () => {
  const validateCreateGroupElement = async (
    body: ValidateCreateGroupElementBody,
  ): Promise<ApiResponse<void>> => {
    return await ApiSingleton.getInstance()
      .groups.groupControllerValidateCreateGroupElement(body)
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  const fetchGroups = useCallback(async (): Promise<
    ApiResponse<GetGroupsRes>
  > => {
    return await ApiSingleton.getInstance()
      .groups.groupControllerGetGroups()
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  }, []);

  const createGroup = async (
    params: GroupControllerCreateGroupParams,
    body: CreateGroupBody,
  ): Promise<ApiResponse<void>> => {
    return await ApiSingleton.getInstance()
      .groups.groupControllerCreateGroup(params, body)
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  return {
    fetchGroups,
    createGroup,
    validateCreateGroupElement,
  };
};
