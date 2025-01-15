import axios from 'axios';
import { LocalStorageKeys } from '../types';
import {
  AuthControllerCharacterSelectParams,
  GetCharacter,
} from '@rimgosu/libs';
import { useCallback } from 'react';

export const useCharacter = () => {
  const accessToken: LocalStorageKeys = 'accessToken';

  const getCharacter = useCallback(async (): Promise<GetCharacter[]> => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/characters`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(accessToken)}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      return [];
    }
  }, []);
  const selectCharacter = async (
    params: AuthControllerCharacterSelectParams,
  ) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/character-select`,
        null,
        {
          params,
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
