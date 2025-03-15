import { ApiSingleton } from '../../common/apiSingleton';
import { ApiErrorType } from '../../common/types';

export const useUsers = () => {
  const fetchMoney = async () => {
    return await ApiSingleton.getInstance()
      .users.userControllerGetMoney()
      .then((res) => res.data)
      .catch(async (error: Response) => {
        return (await error.json()) as ApiErrorType;
      });
  };

  return {
    fetchMoney,
  };
};
