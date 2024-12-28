import React, { Component } from "react";

interface CharacterSelectState {
  selectedCharacter: string | null;
}

export class CharacterSelect extends Component<{}, CharacterSelectState> {
  state: CharacterSelectState = {
    selectedCharacter: null,
  };

  characters = [
    { id: "norangi", name: "노랑이", image: "/norangi.png" },
    { id: "parangi", name: "파랑이", image: "/parangi.png" },
    { id: "chorongi", name: "초롱이", image: "/chorongi.png" },
  ];

  handleCharacterSelect = (characterId: string) => {
    this.setState({ selectedCharacter: characterId });
  };

  render() {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">캐릭터 선택</h2>
        <div className="flex gap-4">
          {this.characters.map((character) => (
            <button
              key={character.id}
              onClick={() => this.handleCharacterSelect(character.id)}
              className={`p-4 border rounded-lg ${
                this.state.selectedCharacter === character.id
                  ? "border-green-500"
                  : ""
              }`}
            >
              <img
                src={character.image}
                alt={character.name}
                className="w-16 h-16"
              />
              <p>{character.name}</p>
            </button>
          ))}
        </div>
        <button
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={!this.state.selectedCharacter}
        >
          선택하기
        </button>
      </div>
    );
  }
}
