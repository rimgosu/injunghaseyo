import { useCallback } from 'react';
import {
  CharacterControllerCharacterSelectParams,
  GetCharacter,
} from '@rimgosu/libs';
import { ApiSingleton } from '../../common/apiSingleton';
import { ApiErrorType, ApiResponse } from '../../common/types';

export const useCharacter = () => {
  const getCharacter = useCallback(async (): Promise<
    ApiResponse<GetCharacter[]>
  > => {
    return await ApiSingleton.getInstance()
      .characters.characterControllerGetCharacters()
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  }, []);

  const selectCharacter = async (
    params: CharacterControllerCharacterSelectParams,
  ): Promise<ApiResponse<void>> => {
    return await ApiSingleton.getInstance()
      .characters.characterControllerCharacterSelect(params)
      .then((res) => ({ data: res.data }))
      .catch(async (error: Response) => {
        return { error: (await error.json()) as ApiErrorType };
      });
  };

  return {
    getCharacter,
    selectCharacter,
  };
};
