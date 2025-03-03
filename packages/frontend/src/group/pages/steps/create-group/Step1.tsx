import { Input } from '../../../../common/components/Input';
import { useCreateGroupStore } from '../../../stores/useCreateGroupStore';

export const CreateGroupStep1 = () => {
  const { formData, updateFormData } = useCreateGroupStore();

  return (
    <div className="flex flex-col gap-6">
      <Input
        label="모임 제목"
        type="text"
        value={formData.title}
        name="모임 제목"
        onChange={(e) => {
          updateFormData({ title: e.target.value });
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
