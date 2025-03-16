import { useProofMethodStore } from '../../../stores/useProofMethodStore';
import { ProofMethodCard } from '../../../components/ProofMethodCard';

export const CreateGroupStep2ViewMode = () => {
  const { proofMethods, removeProofMethod, setCreateProofMethodMode } =
    useProofMethodStore();

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
    </div>
  );
};
