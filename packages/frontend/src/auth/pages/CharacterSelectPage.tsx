import { BaseLayout } from '../../common/BaseLayout';
import React, { useEffect, useState } from 'react';
import {
  CharacterControllerCharacterSelectParams,
  GetCharacter,
} from '@rimgosu/libs';
import { useCharacter } from '../../character/hooks/useCharacter';
import { GreenButton } from '../components/GreenButton';
import { useNavigate } from 'react-router-dom';

export const CharacterSelectPage = () => {
  const navigate = useNavigate();
  const { getCharacter, selectCharacter } = useCharacter();

  const [characters, setCharacters] = useState<GetCharacter[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const loadCharacters = async () => {
      const result = await getCharacter();
      result.data && setCharacters(result.data);
    };
    loadCharacters();
  }, [getCharacter]);

  const handleSelectCharacter = async (
    param: CharacterControllerCharacterSelectParams,
  ) => {
    const { characterId } = param;
    setSelectedCharacter(characterId);
  };

  const handleSubmit = async () => {
    if (selectedCharacter) {
      await selectCharacter({ characterId: selectedCharacter });
      navigate('/group');
    }
  };

  return (
    <BaseLayout isMainLogo>
      <div className="mb-6 flex flex-col items-center">
        <div className="grid grid-cols-3 gap-4">
          {characters.map((character) => (
            <div
              key={character.id}
              onClick={() =>
                handleSelectCharacter({ characterId: character.id })
              }
              className={`flex cursor-pointer flex-col items-center rounded-lg border p-4 hover:border-green-500 ${selectedCharacter === character.id ? 'border-green-500' : ''}`}
            >
              <img
                src={character.characterInfos[0].photoUrl}
                alt={character.name}
                className="mb-2 h-24 w-24"
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
    </BaseLayout>
  );
};
