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
      <div>
        {characters.map((character) => (
          <div key={character.id}>{character.name}</div>
        ))}
      </div>
    </AuthLayout>
  );
};
