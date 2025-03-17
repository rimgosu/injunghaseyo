import { ProofMethodElem } from '@rimgosu/libs';
import { create } from 'zustand';
import { useCreateGroupStore } from './useCreateGroupStore';

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
  setProofMethods: (proofMethods) => {
    set({ proofMethods });
    useCreateGroupStore.getState().updateFormData({ proofMethods });
  },
  addProofMethod: (proofMethod) =>
    set((state) => {
      const newProofMethods = [...state.proofMethods, proofMethod];
      useCreateGroupStore
        .getState()
        .updateFormData({ proofMethods: newProofMethods });
      return { proofMethods: newProofMethods };
    }),
  removeProofMethod: (proofMethod) =>
    set((state) => {
      const newProofMethods = state.proofMethods.filter(
        (method) => method !== proofMethod,
      );
      useCreateGroupStore
        .getState()
        .updateFormData({ proofMethods: newProofMethods });
      return { proofMethods: newProofMethods };
    }),
}));
