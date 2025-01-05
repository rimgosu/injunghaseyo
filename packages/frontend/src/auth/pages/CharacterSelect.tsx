import { AuthLayout } from "../AuthLayout";
import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { GetCharacter } from "@rimgosu/libs";

// async 제거
export const CharacterSelectPage = () => {
  const { getCharacter } = useAuth();
  const [characters, setCharacters] = useState<GetCharacter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const result = await getCharacter();
        setCharacters(result);
        console.log(result);
      } catch (error) {
        console.error("캐릭터 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCharacters();
  }, [getCharacter]);

  if (isLoading) {
    return <AuthLayout>로딩중...</AuthLayout>;
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-3 gap-4">
          {characters.map((character) => (
            <div
              key={character.id}
              className="flex flex-col items-center p-4 border rounded-lg cursor-pointer hover:border-green-500"
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
        <button className="mt-6 px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600">
          선택하기
        </button>
      </div>
    </AuthLayout>
  );
};
