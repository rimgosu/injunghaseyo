import { GetCheckSignIn, GetCheckSignInUserStatusEnum } from '@rimgosu/libs';
import { create } from 'zustand';

type TCheckSignInStore = {
  checkSignInRes: GetCheckSignIn;
  isSignedIn: boolean;
  isInitialized: boolean;
  setCheckSignInRes: (res: GetCheckSignIn) => void;
  setIsSignedIn: (isSignedIn: boolean) => void;
  setIsInitialized: (isInitialized: boolean) => void;
};

export const useCheckSignInStore = create<TCheckSignInStore>((set) => ({
  checkSignInRes: {
    userStatus: GetCheckSignInUserStatusEnum.ACTIVE,
    checkLevelUpResult: null,
    userId: 0,
    profilePhoto: '',
  },
  isSignedIn: false,
  isInitialized: false,
  setCheckSignInRes: (res) => set({ checkSignInRes: res }),
  setIsSignedIn: (isSignedIn) => set({ isSignedIn }),
  setIsInitialized: (isInitialized) => set({ isInitialized }),
}));
