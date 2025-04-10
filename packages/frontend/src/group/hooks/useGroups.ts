import {
  CreateGroupBody,
  GetGroupRes,
  GetGroupsRes,
  GetTagsRes,
  GetTodayRewardRes,
  GroupControllerCreateGroupParams,
  GroupControllerGetGroupsParams,
  GroupControllerGetTagsParams,
  GroupControllerGetTodayParams,
  GroupControllerUploadProofButtonParams,
  GroupControllerUploadProofLocationParams,
  GroupControllerUploadProofPhotoParams,
  ModifiedGetTodayRes,
  UploadProofRes,
  ValidateCreateGroupElementBody,
} from '@rimgosu/libs';
import { ApiSingleton } from '../../common/apiSingleton';
import { ApiErrorType, ApiResponse } from '../../common/types';
import { useCallback } from 'react';

export const useGroups = () => {
  const getTodayReward = async (
    groupId: number,
  ): Promise<ApiResponse<GetTodayRewardRes>> => {
    return await ApiSingleton.getInstance()
      .groups.groupControllerGetTodayReward(groupId)
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  const uploadProofLocation = async (
    params: GroupControllerUploadProofLocationParams,
  ): Promise<ApiResponse<UploadProofRes>> => {
    return await ApiSingleton.getInstance()
      .groups.groupControllerUploadProofLocation(params)
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  const uploadProofButton = async (
    params: GroupControllerUploadProofButtonParams,
  ): Promise<ApiResponse<UploadProofRes>> => {
    return await ApiSingleton.getInstance()
      .groups.groupControllerUploadProofButton(params)
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  const uploadProofPhoto = async (
    params: GroupControllerUploadProofPhotoParams,
    proofPhoto: File,
  ): Promise<ApiResponse<UploadProofRes>> => {
    return await ApiSingleton.getInstance()
      .groups.groupControllerUploadProofPhoto(params, {
        proofPhoto,
      })
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  const getToday = async (
    params: GroupControllerGetTodayParams,
  ): Promise<ApiResponse<ModifiedGetTodayRes>> => {
    return await ApiSingleton.getInstance()
      .groups.groupControllerGetToday(params)
      .then((res) => {
        const data = res.data as ModifiedGetTodayRes;
        return { data };
      })
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  const getTags = async (
    query: GroupControllerGetTagsParams,
  ): Promise<ApiResponse<GetTagsRes>> => {
    return await ApiSingleton.getInstance()
      .groups.groupControllerGetTags(query)
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

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

  const fetchGroups = useCallback(
    async (
      query: GroupControllerGetGroupsParams,
    ): Promise<ApiResponse<GetGroupsRes>> => {
      return await ApiSingleton.getInstance()
        .groups.groupControllerGetGroups(query)
        .then((res) => ({ data: res.data }))
        .catch(async (error: Response) => {
          return { error: (await error.json()) as ApiErrorType };
        });
    },
    [],
  );

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

  const getGroup = async (
    groupId: number,
  ): Promise<ApiResponse<GetGroupRes>> => {
    return await ApiSingleton.getInstance()
      .groups.groupControllerGetGroup(groupId)
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  return {
    fetchGroups,
    createGroup,
    validateCreateGroupElement,
    getTags,
    getGroup,
    getToday,
    uploadProofLocation,
    uploadProofButton,
    uploadProofPhoto,
    getTodayReward,
  };
};
