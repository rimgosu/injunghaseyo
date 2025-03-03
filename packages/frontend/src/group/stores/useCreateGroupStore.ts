import { create } from 'zustand';
import {
  CreateGroupBody,
  GroupControllerCreateGroupParams,
} from '@rimgosu/libs';

export type CreateGroupStore = {
  step: '모임생성' | '인증방법' | '시간정하기' | '모임상세' | '태그';
  formData: GroupControllerCreateGroupParams & CreateGroupBody;
  error: string | null;
  isValid: boolean;
  setError: (error: string | null) => void;
  setIsValid: (isValid: boolean) => void;
  setStep: (step: CreateGroupStore['step']) => void;
  updateFormData: (data: Partial<GroupControllerCreateGroupParams>) => void;
};

export const useCreateGroupStore = create<CreateGroupStore>((set) => ({
  step: '모임생성',
  formData: {
    title: '',
    price: 30000,
    description: '',
    proofMethods: [],
    dates: [],
    tags: [],
  },
  error: null,
  isValid: false,
  setError: (error) => set({ error }),
  setIsValid: (isValid) => set({ isValid }),
  setStep: (step) => set({ step }),
  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
}));
