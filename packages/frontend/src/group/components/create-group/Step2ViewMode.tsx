import { useEffect } from 'react';
import { useProofMethodStore } from '../../stores/useProofMethodStore';
import { useCreateGroupStore } from '../../stores/useCreateGroupStore';
import { ProofMethodCard } from '../ProofMethodCard';
import { ValidationMessage } from '../../../common/components/ValidationMessage';

export const CreateGroupStep2ViewMode = () => {
  const { proofMethods, removeProofMethod, setCreateProofMethodMode } =
    useProofMethodStore();
  const { isValid, setIsValid } = useCreateGroupStore();

  useEffect(() => {
    if (proofMethods.length === 0) {
      setIsValid(false);
      return;
    }
    setIsValid(true);
  }, [proofMethods]);

  return (
    <div className="space-y-4">
      {proofMethods.map((proofMethod) => (
        <ProofMethodCard
          key={proofMethod.contents}
          proofMethod={proofMethod}
          onDelete={removeProofMethod}
        />
      ))}

      <button
        className="w-full border rounded-lg p-4 text-blue-600 hover:bg-blue-50 transition-colors"
        onClick={() => setCreateProofMethodMode('add')}
      >
        + 인증 방법 추가하기
      </button>

      {!isValid && (
        <ValidationMessage message="인증 방법을 하나 이상 추가해야 합니다." />
      )}
    </div>
  );
};
