import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type StepType = '모임생성' | '인증방법' | '시간정하기' | '인증방법' | '태그';

interface GroupFormData {
  name: string;
  amount: number;
  verificationMethod: string;
  schedule: string;
  tags: string[];
}

export const CreateGroupFlow = () => {
  const [currentStep, setCurrentStep] = useState<StepType>('모임생성');
  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    amount: 0,
    verificationMethod: '',
    schedule: '',
    tags: [],
  });

  const navigate = useNavigate();

  const handleNext = () => {
    // 현재 스텝에 따라 다음 스텝으로 이동하는 로직
    switch (currentStep) {
      case '모임생성':
        setCurrentStep('인증방법');
        break;
      case '인증방법':
        setCurrentStep('시간정하기');
        break;
      // ... 나머지 스텝들
    }
  };

  const handleSubmit = async () => {
    try {
      // API 호출
      await createGroup(formData);
      navigate('/groups');
    } catch (error) {
      console.error('그룹 생성 실패:', error);
    }
  };

  return (
    <div className="p-4">
      {currentStep === '모임생성' && (
        <GroupBasicInfo
          formData={formData}
          onChange={(data) => setFormData({ ...formData, ...data })}
        />
      )}
      {/* 다른 스텝들의 컴포넌트들 */}

      <button
        onClick={currentStep === '태그' ? handleSubmit : handleNext}
        className="w-full py-3 bg-green-500 text-white rounded-xl mt-4"
      >
        {currentStep === '태그' ? '생성하기' : '다음'}
      </button>
    </div>
  );
};
