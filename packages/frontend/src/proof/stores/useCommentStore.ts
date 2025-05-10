import { ProofCommentItem } from '@rimgosu/libs';
import { createStore, useStore } from 'zustand';

type TCommentStore = {
  comments: ProofCommentItem[];
  setComments: (comments: ProofCommentItem[]) => void;
  cursor: number | undefined;
  setCursor: (cursor: number | undefined) => void;
  hasNextPage: boolean;
  setHasNextPage: (hasNextPage: boolean) => void;
};

const storeMap = new Map<number, ReturnType<typeof createCommentStore>>();

const createCommentStore = () =>
  createStore<TCommentStore>((set) => ({
    comments: [],
    setComments: (comments) => set({ comments }),
    cursor: undefined,
    setCursor: (cursor) => set({ cursor }),
    hasNextPage: true,
    setHasNextPage: (hasNextPage) => set({ hasNextPage }),
  }));

export const useCommentStore = (proofId: number) => {
  if (!storeMap.has(proofId)) {
    storeMap.set(proofId, createCommentStore());
  }

  const store = storeMap.get(proofId) as ReturnType<typeof createCommentStore>;
  return useStore(store);
};
