import { ProofCommentItem } from '@rimgosu/libs';
import { create } from 'zustand';

type TCommentStore = {
  comments: ProofCommentItem[];
  setComments: (comments: ProofCommentItem[]) => void;
  cursor: number | undefined;
  setCursor: (cursor: number | undefined) => void;
  hasNextPage: boolean;
  setHasNextPage: (hasNextPage: boolean) => void;
};

export const useCommentStore = create<TCommentStore>((set) => ({
  comments: [],
  setComments: (comments) => set({ comments }),
  cursor: undefined,
  setCursor: (cursor) => set({ cursor }),
  hasNextPage: false,
  setHasNextPage: (hasNextPage) => set({ hasNextPage }),
}));
