import {
  GetMoneyDto,
  GetOtherProfileResDto,
  GetProfileResDto,
} from '@rimgosu/libs';
import { ApiSingleton } from '../../common/apiSingleton';
import { ApiErrorType, ApiResponse } from '../../common/types';

export const useUsers = () => {
  const editProfile = async (
    introduction: string,
  ): Promise<ApiResponse<void>> => {
    return await ApiSingleton.getInstance()
      .users.userControllerUpdateUser({ introduction })
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  const fetchOtherProfile = async (
    userId: number,
  ): Promise<ApiResponse<GetOtherProfileResDto>> => {
    return await ApiSingleton.getInstance()
      .users.userControllerGetOtherProfile(userId)
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  const fetchMoney = async (): Promise<ApiResponse<GetMoneyDto>> => {
    return await ApiSingleton.getInstance()
      .users.userControllerGetMoney()
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  const fetchProfile = async (): Promise<ApiResponse<GetProfileResDto>> => {
    return await ApiSingleton.getInstance()
      .users.userControllerGetProfile()
      .then((res) => ({
        data: res.data,
      }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  const uploadProfilePhoto = async (
    profilePhoto: File,
  ): Promise<ApiResponse<void>> => {
    return await ApiSingleton.getInstance()
      .users.userControllerAddProfilePhoto({
        profilePhoto,
      })
      .then((res) => ({
        data: res.data,
      }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  const deleteProfilePhoto = async (
    profilePhotoId: number,
  ): Promise<ApiResponse<void>> => {
    return await ApiSingleton.getInstance()
      .users.userControllerDeleteProfilePhoto(profilePhotoId)
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };
  return {
    fetchMoney,
    fetchProfile,
    uploadProfilePhoto,
    deleteProfilePhoto,
    fetchOtherProfile,
    editProfile,
  };
};
