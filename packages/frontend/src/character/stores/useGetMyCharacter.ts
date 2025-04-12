import { GetMyCharacter } from '@rimgosu/libs';
import { create } from 'zustand';

export type TGetMyCharacter = {
  myCharacter: GetMyCharacter | null;
  setMyCharacter: (myCharacter: GetMyCharacter) => void;
};

export const useGetMyCharacterStore = create<TGetMyCharacter>((set) => ({
  myCharacter: null,
  setMyCharacter: (myCharacter) => set({ myCharacter }),
}));
