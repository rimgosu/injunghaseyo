import { useCallback } from 'react';
import {
  AuthControllerCharacterSelectParams,
  GetCharacter,
} from '@rimgosu/libs';
import { ApiSingleton } from '../../common/apiSingleton';
import { LocalStorageKeys } from '../types';

export const useCharacter = () => {
  const accessToken: LocalStorageKeys = 'accessToken';

  const getCharacter = useCallback(async (): Promise<GetCharacter[]> => {
    try {
      const response =
        await ApiSingleton.getInstance().auth.authControllerGetCharacters({
          headers: {
            Authorization: `Bearer ${localStorage.getItem(accessToken)}`,
          },
        });
      return response.data;
    } catch (error) {
      return [];
    }
  }, []);

  const selectCharacter = async (
    params: AuthControllerCharacterSelectParams,
  ) => {
    try {
      const response =
        await ApiSingleton.getInstance().auth.authControllerCharacterSelect(
          params,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(accessToken)}`,
            },
          },
        );
      return response.data;
    } catch (error) {
      console.error('캐릭터 선택 실패:', error);
    }
  };

  return {
    getCharacter,
    selectCharacter,
  };
};
