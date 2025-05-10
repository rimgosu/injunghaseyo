import { ProofReplyItem } from '@rimgosu/libs';
import { createStore, useStore } from 'zustand';

type TReplyStore = {
  replies: ProofReplyItem[];
  setReplies: (replies: ProofReplyItem[]) => void;
  cursor: number | undefined;
  setCursor: (cursor: number | undefined) => void;
  hasNextPage: boolean;
  setHasNextPage: (hasNextPage: boolean) => void;
};

const storeMap = new Map<number, ReturnType<typeof createReplyStore>>();

const createReplyStore = () =>
  createStore<TReplyStore>((set) => ({
    replies: [],
    setReplies: (replies) => set({ replies }),
    cursor: undefined,
    setCursor: (cursor) => set({ cursor }),
    hasNextPage: true,
    setHasNextPage: (hasNextPage) => set({ hasNextPage }),
  }));

export const useReplyStore = (parentCommentId: number) => {
  if (!storeMap.has(parentCommentId)) {
    storeMap.set(parentCommentId, createReplyStore());
  }

  const store = storeMap.get(parentCommentId) as ReturnType<
    typeof createReplyStore
  >;
  return useStore(store);
};
