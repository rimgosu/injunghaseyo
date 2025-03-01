import { Input } from '../../../../common/components/Input';
import { useCreateGroupStore } from '../../../stores/useCreateGroupStore';

export const CreateGroupStep2 = () => {
  const { formData, updateFormData } = useCreateGroupStore();

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="인증 방법"
        type="text"
        value={formData.proofMethods.join(', ')} // todo: 인증 방법 기획 수정
        name="인증 방법"
        onChange={(e) => {
          updateFormData({ proofMethods: [e.target.value] });
        }}
        required
      />
      <Input
        label="모임 가격"
        type="number"
        value={formData.price}
        name="모임 가격"
        onChange={(e) => {
          updateFormData({ price: Number(e.target.value) });
        }}
        required
      />
    </div>
  );
};
