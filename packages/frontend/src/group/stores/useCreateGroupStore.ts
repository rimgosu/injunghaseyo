import { create } from 'zustand';
import { GroupControllerCreateGroupParams } from '@rimgosu/libs';

export type CreateGroupStore = {
  step: '모임생성' | '인증방법' | '시간정하기' | '모임상세' | '태그';
  formData: GroupControllerCreateGroupParams;
  setStep: (step: CreateGroupStore['step']) => void;
  updateFormData: (data: Partial<GroupControllerCreateGroupParams>) => void;
};

export const useCreateGroupStore = create<CreateGroupStore>((set) => ({
  step: '모임생성',
  formData: {
    title: '',
    price: 0,
    description: '',
    proofMethods: [],
    dates: [],
    tags: [],
  },
  setStep: (step) => set({ step }),
  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
}));
