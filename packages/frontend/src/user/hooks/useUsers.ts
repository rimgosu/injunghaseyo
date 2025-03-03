import { useCallback, useState } from 'react';
import { ApiSingleton } from '../../common/apiSingleton';

export const useUsers = () => {
  const [moneyData, setMoneyData] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);
  const accessToken = localStorage.getItem('accessToken');

  const fetchMoney = useCallback(async () => {
    try {
      const response =
        await ApiSingleton.getInstance().users.userControllerGetMoney({
          format: 'json',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

      setMoneyData(response.data.money);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('잔액을 불러오는데 실패했습니다.'),
      );
    }
  }, []);

  return {
    moneyData,
    error,
    fetchMoney,
  };
};
