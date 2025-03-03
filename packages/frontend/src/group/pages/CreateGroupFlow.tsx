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
import { NavigationButtons } from '../../common/components/NavigationButtons';

const stepMap: Record<CreateGroupStore['step'], CreateGroupStore['step']> = {
  모임생성: '인증방법',
  인증방법: '시간정하기',
  시간정하기: '모임상세',
  모임상세: '태그',
  태그: '태그',
} as const;

const reverseStepMap: Record<
  CreateGroupStore['step'],
  CreateGroupStore['step']
> = {
  인증방법: '모임생성',
  시간정하기: '인증방법',
  모임상세: '시간정하기',
  태그: '모임상세',
  모임생성: '모임생성',
} as const;

export const CreateGroupFlow = () => {
  const navigate = useNavigate();
  const { createGroup } = useGroups();
  const { step, formData } = useCreateGroupStore();
  const { createProofMethodMode: mode } = useProofMethodStore();

  const handleNext = () => {
    useCreateGroupStore.getState().setStep(stepMap[step]);
  };

  const handleBack = () => {
    useCreateGroupStore.getState().setStep(reverseStepMap[step]);
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
    <BaseLayout
      navigationButtons={
        <NavigationButtons
          onBack={handleBack}
          onNext={step === '태그' ? handleSubmit : handleNext}
          mode={mode}
          nextButtonText={step === '태그' ? '생성하기' : '다음'}
        />
      }
    >
      {step === '모임생성' && <CreateGroupStep1 />}
      {step === '인증방법' && <CreateGroupStep2 />}
    </BaseLayout>
  );
};
