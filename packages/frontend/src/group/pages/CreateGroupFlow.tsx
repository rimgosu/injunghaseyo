import { useNavigate } from 'react-router-dom';
import { useGroups } from '../hooks/useGroups';
import { BaseLayout } from '../../common/BaseLayout';
import { CreateGroupStep1 } from './steps/create-group/Step1';
import {
  CreateGroupStore,
  useCreateGroupStore,
} from '../stores/useCreateGroupStore';
import { CreateGroupStep2 } from './steps/create-group/Step2';
import { useProofMethodStore } from '../stores/useProofMethodStore';

const stepMap: Record<CreateGroupStore['step'], CreateGroupStore['step']> = {
  모임생성: '인증방법',
  인증방법: '시간정하기',
  시간정하기: '모임상세',
  모임상세: '태그',
  태그: '태그',
} as const;

export const CreateGroupFlow = () => {
  const navigate = useNavigate();
  const { createGroup } = useGroups();
  const { step, formData } = useCreateGroupStore();
  const { createProofMethodMode: mode } = useProofMethodStore();

  const handleNext = () => {
    useCreateGroupStore.getState().setStep(stepMap[step]);
  };

  const handleSubmit = async () => {
    try {
      const { proofMethods, ...restFormData } = formData;
      await createGroup(restFormData, { proofMethods });
      navigate('/group');
    } catch (error) {
      console.error('그룹 생성 실패:', error);
    }
  };

  return (
    <BaseLayout>
      {step === '모임생성' && <CreateGroupStep1 />}
      {step === '인증방법' && <CreateGroupStep2 />}
      {mode !== 'add' && (
        <button
          onClick={step === '태그' ? handleSubmit : handleNext}
          className="w-full py-3 bg-green-500 text-white rounded-xl mt-4"
        >
          {step === '태그' ? '생성하기' : '다음'}
        </button>
      )}
    </BaseLayout>
  );
};
