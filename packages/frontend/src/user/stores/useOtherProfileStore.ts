import { create } from 'zustand';
import { GetOtherProfileResDto } from '@rimgosu/libs';

interface OtherProfileStore {
  profileData: GetOtherProfileResDto | null;
  setProfileData: (data: GetOtherProfileResDto | null) => void;
}

export const useOtherProfileStore = create<OtherProfileStore>((set) => ({
  profileData: null,
  setProfileData: (data) => set({ profileData: data }),
}));
