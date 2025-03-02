import { useCreateGroupStore } from '../../../stores/useCreateGroupStore';
import { useProofMethodStore } from '../../../stores/useProofMethodStore';
import { CreateGroupStep2AddProofMethod } from './Step2AddMode';

export const CreateGroupStep2 = () => {
  const { formData, updateFormData } = useCreateGroupStore();
  const {
    proofMethods,
    createProofMethodMode,
    removeProofMethod,
    setCreateProofMethodMode,
  } = useProofMethodStore();

  return (
    <div className="flex flex-col gap-4">
      {createProofMethodMode === 'view' &&
        proofMethods.map((proofMethod) => (
          <div key={proofMethod.contents}>
            <div>{proofMethod.contents}</div>
            <div>{proofMethod.type}</div>
            <div>{proofMethod.fromMin}</div>
            <div>{proofMethod.toMin}</div>
            <button onClick={() => removeProofMethod(proofMethod)}>
              삭제하기
            </button>
          </div>
        ))}
      {createProofMethodMode === 'view' && (
        <button
          className="border p-4"
          onClick={() => setCreateProofMethodMode('add')}
        >
          추가하기
        </button>
      )}
      {createProofMethodMode === 'add' && <CreateGroupStep2AddProofMethod />}
    </div>
  );
};
