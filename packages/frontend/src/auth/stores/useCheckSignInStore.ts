import { GetCheckSignIn, GetCheckSignInUserStatusEnum } from '@rimgosu/libs';
import { create } from 'zustand';

type TCheckSignInStore = {
  checkSignInRes: GetCheckSignIn;
  isSignedIn: boolean;
  setCheckSignInRes: (res: GetCheckSignIn) => void;
  setIsSignedIn: (isSignedIn: boolean) => void;
};

export const useCheckSignInStore = create<TCheckSignInStore>((set) => ({
  checkSignInRes: {
    userStatus: GetCheckSignInUserStatusEnum.ACTIVE,
    checkLevelUpResult: null,
  },
  isSignedIn: false,
  setCheckSignInRes: (res) => set({ checkSignInRes: res }),
  setIsSignedIn: (isSignedIn) => set({ isSignedIn }),
}));
