import { useNavigate } from 'react-router-dom';
import { useGroups } from '../hooks/useGroups';
import { BaseLayout } from '../../common/BaseLayout';
import {
  CreateGroupStore,
  useCreateGroupStore,
} from '../stores/useCreateGroupStore';
import { useProofMethodStore } from '../stores/useProofMethodStore';
import { NavigationButtons } from '../../common/components/NavigationButtons';
import { ValidationMessage } from '../../common/components/ValidationMessage';
import { CreateGroupStep1 } from '../components/create-group/Step1';
import { CreateGroupStep2 } from '../components/create-group/Step2';
import { CreateGroupStep3 } from '../components/create-group/Step3';
import { CreateGroupStep4 } from '../components/create-group/Step4';

const stepMap: Record<CreateGroupStore['step'], CreateGroupStore['step']> = {
  모임생성: '인증방법',
  인증방법: '시간정하기',
  시간정하기: '태그',
  태그: '태그',
} as const;

const reverseStepMap: Record<
  CreateGroupStore['step'],
  CreateGroupStore['step']
> = {
  인증방법: '모임생성',
  시간정하기: '인증방법',
  태그: '시간정하기',
  모임생성: '모임생성',
} as const;

export const CreateGroupFlow = () => {
  const navigate = useNavigate();
  const { createGroup } = useGroups();
  const { step, formData, error, isValid, clearFormData } =
    useCreateGroupStore();
  const { createProofMethodMode, setCreateProofMethodMode, clearProofMethods } =
    useProofMethodStore();

  const handleNext = () => {
    useCreateGroupStore.getState().setStep(stepMap[step]);
  };

  const handleBack = () => {
    if (createProofMethodMode === 'add') {
      setCreateProofMethodMode('view');
      return;
    }
    if (step === '모임생성') {
      navigate('/group');
      return;
    }
    useCreateGroupStore.getState().setStep(reverseStepMap[step]);
  };

  const handleSubmit = async () => {
    const { proofMethods, ...restFormData } = formData;
    const res = await createGroup(restFormData, { proofMethods });
    if (res.error) {
      alert(res.error.message);
    } else {
      clearFormData();
      clearProofMethods();
      navigate('/group');
    }
  };

  const getNextButtonText = (): string => {
    if (step === '태그' && (formData.tags?.length === 0 || !formData.tags))
      return '건너뛰고 생성하기';
    if (step === '태그') return '생성하기';
    return '다음';
  };

  return (
    <BaseLayout
      bottomButton={
        <NavigationButtons
          onBack={handleBack}
          onNext={step === '태그' ? handleSubmit : handleNext}
          mode={createProofMethodMode}
          nextButtonText={getNextButtonText()}
          disabled={!isValid}
        />
      }
      isMainLogo
    >
      {step === '모임생성' && <CreateGroupStep1 />}
      {step === '인증방법' && <CreateGroupStep2 />}
      {step === '시간정하기' && <CreateGroupStep3 />}
      {step === '태그' && <CreateGroupStep4 />}
      {error && <ValidationMessage message={error} />}
    </BaseLayout>
  );
};
