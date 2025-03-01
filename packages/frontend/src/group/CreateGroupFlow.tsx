import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGroups } from './hooks/useGroups';
import { GroupControllerCreateGroupParams } from '@rimgosu/libs';
import { BaseLayout } from '../common/BaseLayout';

type StepType = '모임생성' | '인증방법' | '시간정하기' | '인증방법' | '태그';

export const CreateGroupFlow = () => {
  const [currentStep, setCurrentStep] = useState<StepType>('모임생성');
  const [formData, setFormData] = useState<GroupControllerCreateGroupParams>({
    title: '',
    price: 0,
    description: '',
    proofMethods: [],
    dates: [],
    tags: [],
  });

  const navigate = useNavigate();

  const { createGroup } = useGroups();

  const handleNext = () => {
    switch (currentStep) {
      case '모임생성':
        setCurrentStep('인증방법');
        break;
      case '인증방법':
        setCurrentStep('시간정하기');
        break;
    }
  };

  const handleSubmit = async () => {
    try {
      // API 호출
      await createGroup(formData);
      navigate('/group');
    } catch (error) {
      console.error('그룹 생성 실패:', error);
    }
  };

  return (
    <BaseLayout>
      {currentStep === '모임생성' && <div>step1</div>}

      <button
        onClick={currentStep === '태그' ? handleSubmit : handleNext}
        className="w-full py-3 bg-green-500 text-white rounded-xl mt-4"
      >
        {currentStep === '태그' ? '생성하기' : '다음'}
      </button>
    </BaseLayout>
  );
};
