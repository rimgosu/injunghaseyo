import { AuthLayout } from '../../common/Layout';
import React, { useEffect, useState } from 'react';
import {
  AuthControllerCharacterSelectParams,
  GetCharacter,
} from '@rimgosu/libs';
import { useCharacter } from '../hooks/useCharacter';
import { GreenButton } from '../components/GreenButton';

export const CharacterSelectPage = () => {
  const { getCharacter, selectCharacter } = useCharacter();

  const [characters, setCharacters] = useState<GetCharacter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const result = await getCharacter();
        setCharacters(result);
        console.log(result);
      } catch (error) {
        console.error('캐릭터 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCharacters();
  }, [getCharacter]); // getCharacter 의존성 제거

  if (isLoading) {
    return <AuthLayout>로딩중...</AuthLayout>;
  }

  const handleSelectCharacter = async (
    param: AuthControllerCharacterSelectParams,
  ) => {
    const { characterId } = param;
    setSelectedCharacter(characterId);
    console.log(selectedCharacter);
  };

  const handleSubmit = async () => {
    if (selectedCharacter) {
      await selectCharacter({ characterId: selectedCharacter });
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center mb-6">
        <div className="grid grid-cols-3 gap-4">
          {characters.map((character) => (
            <div
              key={character.id}
              onClick={() =>
                handleSelectCharacter({ characterId: character.id })
              }
              className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer hover:border-green-500 
                ${selectedCharacter === character.id ? 'border-green-500' : ''}`}
            >
              <div
                className="w-24 h-24 mb-2"
                dangerouslySetInnerHTML={{
                  __html: character.characterInfos[0].photoUrl,
                }}
              />
              <div className="text-center font-medium">{character.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full p-2">
        <GreenButton
          onClick={handleSubmit}
          text="선택하기"
          disabled={selectedCharacter === null}
        />
      </div>
    </AuthLayout>
  );
};
