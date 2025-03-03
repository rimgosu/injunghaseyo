import { ValidateCreateGroupElementBodyValidateTypeEnum } from '@rimgosu/libs';
import { Input } from '../../../../common/components/Input';
import { useGroups } from '../../../hooks/useGroups';
import { useCreateGroupStore } from '../../../stores/useCreateGroupStore';
import { useEffect } from 'react';

export const CreateGroupStep1 = () => {
  const { formData, updateFormData, setError } = useCreateGroupStore();
  const { validateCreateGroupElement } = useGroups();

  useEffect(() => {
    const validate = async () => {
      const error = await validateCreateGroupElement({
        validateValue: formData.price,
        validateType: ValidateCreateGroupElementBodyValidateTypeEnum.PRICE,
      });
      setError(error);
    };
    validate();
  }, [formData.price]);

  return (
    <div className="flex flex-col gap-6">
      <Input
        label="모임 제목"
        type="text"
        value={formData.title}
        name="모임 제목"
        placeholder="모임 제목을 입력하세요"
        onChange={async (e) => {
          updateFormData({ title: e.target.value });
          const error = await validateCreateGroupElement({
            validateValue: e.target.value,
            validateType: ValidateCreateGroupElementBodyValidateTypeEnum.TITLE,
          });
          setError(error);
        }}
        required
      />
      <Input
        label="모임 가격"
        type="number"
        value={formData.price}
        name="모임 가격"
        onChange={async (e) => {
          const value = e.target.value === '' ? 0 : Number(e.target.value);
          updateFormData({ price: value });
        }}
        required
        suffix="원"
      />
    </div>
  );
};
