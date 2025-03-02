import { ProofMethodElem } from '@rimgosu/libs';
import { create } from 'zustand';

export type ProofMethodStore = {
  createProofMethodMode: 'add' | 'view';
  proofMethods: ProofMethodElem[];
  setProofMethods: (proofMethods: ProofMethodElem[]) => void;
  addProofMethod: (proofMethod: ProofMethodElem) => void;
  removeProofMethod: (proofMethod: ProofMethodElem) => void;
  setCreateProofMethodMode: (
    mode: ProofMethodStore['createProofMethodMode'],
  ) => void;
};

export const useProofMethodStore = create<ProofMethodStore>((set) => ({
  createProofMethodMode: 'view',
  proofMethods: [],
  setCreateProofMethodMode: (mode) => set({ createProofMethodMode: mode }),
  setProofMethods: (proofMethods) => set({ proofMethods }),
  addProofMethod: (proofMethod) =>
    set((state) => ({
      proofMethods: [...state.proofMethods, proofMethod],
    })),
  removeProofMethod: (proofMethod) =>
    set((state) => ({
      proofMethods: state.proofMethods.filter(
        (method) => method !== proofMethod,
      ),
    })),
}));
