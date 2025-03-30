import { create } from 'zustand';
import { GetProfileResDto } from '@rimgosu/libs';

interface ProfileStore {
  profileData: GetProfileResDto | null;
  setProfileData: (data: GetProfileResDto | null) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profileData: null,
  setProfileData: (data) => set({ profileData: data }),
}));
