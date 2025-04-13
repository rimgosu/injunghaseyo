import { create } from 'zustand';

export type TPasswordChanged = {
  passwordChanged: boolean;
  setPasswordChanged: (passwordChanged: boolean) => void;
};

export const usePasswordChanged = create<TPasswordChanged>((set) => ({
  passwordChanged: false,
  setPasswordChanged: (passwordChanged: boolean) => {
    set({ passwordChanged });
  },
}));
