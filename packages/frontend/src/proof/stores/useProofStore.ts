import { GetProofRes } from '@rimgosu/libs';
import { createStore, useStore } from 'zustand';

type TProofStore = {
  proof: GetProofRes | null;
  setProof: (proof: GetProofRes) => void;
};

const storeMap = new Map<number, ReturnType<typeof createProofStore>>();

const createProofStore = () =>
  createStore<TProofStore>((set) => ({
    proof: null,
    setProof: (proof) => set({ proof }),
  }));

export const useProofStore = (proofId: number) => {
  if (!storeMap.has(proofId)) {
    storeMap.set(proofId, createProofStore());
  }

  const store = storeMap.get(proofId) as ReturnType<typeof createProofStore>;
  return useStore(store);
};
