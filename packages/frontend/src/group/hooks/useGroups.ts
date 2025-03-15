import {
  CreateGroupBody,
  GroupControllerCreateGroupParams,
  ValidateCreateGroupElementBody,
} from '@rimgosu/libs';
import { ApiSingleton } from '../../common/apiSingleton';
import { ApiErrorType } from '../../common/types';

export const useGroups = () => {
  const validateCreateGroupElement = async (
    body: ValidateCreateGroupElementBody,
  ): Promise<void | ApiErrorType> => {
    return await ApiSingleton.getInstance()
      .groups.groupControllerValidateCreateGroupElement(body)
      .then((res) => res.data)
      .catch(async (error: Response) => {
        return (await error.json()) as ApiErrorType;
      });
  };

  const fetchGroups = async () => {
    return await ApiSingleton.getInstance()
      .groups.groupControllerGetGroups({
        format: 'json',
      })
      .then((res) => res.data)
      .catch(async (error: Response) => {
        return (await error.json()) as ApiErrorType;
      });
  };

  const createGroup = async (
    params: GroupControllerCreateGroupParams,
    body: CreateGroupBody,
  ) => {
    return await ApiSingleton.getInstance()
      .groups.groupControllerCreateGroup(params, body)
      .then((res) => res.data)
      .catch(async (error: Response) => {
        return (await error.json()) as ApiErrorType;
      });
  };

  return {
    fetchGroups,
    createGroup,
    validateCreateGroupElement,
  };
};
