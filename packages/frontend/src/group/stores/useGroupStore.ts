import { GetGroupRes } from '@rimgosu/libs';
import { createStore, useStore } from 'zustand';

type TGroupStore = {
  groupData: GetGroupRes | null;
  setGroupData: (groupData: GetGroupRes | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

const storeMap = new Map<number, ReturnType<typeof createGroupStore>>();

const createGroupStore = () =>
  createStore<TGroupStore>((set) => ({
    groupData: null,
    setGroupData: (groupData) => set({ groupData }),
    isLoading: true,
    setIsLoading: (isLoading) => set({ isLoading }),
  }));

export const useGroupStore = (groupId: number) => {
  if (!storeMap.has(groupId)) {
    storeMap.set(groupId, createGroupStore());
  }

  const store = storeMap.get(groupId) as ReturnType<typeof createGroupStore>;
  return useStore(store);
};
