import { useProofMethodStore } from '../../../stores/useProofMethodStore';
import { CreateGroupStep2AddProofMethod } from './Step2AddMode';
import { CreateGroupStep2ViewMode } from './Step2ViewMode';

export const CreateGroupStep2 = () => {
  const { createProofMethodMode } = useProofMethodStore();

  return (
    <div className="flex flex-col gap-4">
      {createProofMethodMode === 'view' && <CreateGroupStep2ViewMode />}
      {createProofMethodMode === 'add' && <CreateGroupStep2AddProofMethod />}
    </div>
  );
};
