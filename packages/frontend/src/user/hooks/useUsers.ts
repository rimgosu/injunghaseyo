import { GetMoneyDto } from '@rimgosu/libs';
import { ApiSingleton } from '../../common/apiSingleton';
import { ApiErrorType, ApiResponse } from '../../common/types';

export const useUsers = () => {
  const fetchMoney = async (): Promise<ApiResponse<GetMoneyDto>> => {
    return await ApiSingleton.getInstance()
      .users.userControllerGetMoney()
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  return {
    fetchMoney,
  };
};
