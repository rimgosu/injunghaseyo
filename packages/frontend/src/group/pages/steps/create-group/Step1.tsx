import { ValidateCreateGroupElementBodyValidateTypeEnum } from '@rimgosu/libs';
import { Input } from '../../../../common/components/Input';
import { useGroups } from '../../../hooks/useGroups';
import { useCreateGroupStore } from '../../../stores/useCreateGroupStore';
import { useEffect } from 'react';
import { useUsers } from '../../../../user/hooks/useUsers';

export const CreateGroupStep1 = () => {
  const { formData, updateFormData, setError, setIsValid } =
    useCreateGroupStore();
  const { validateCreateGroupElement } = useGroups();
  const { moneyData, fetchMoney } = useUsers();

  const validateForm = async () => {
    const titleError = await validateCreateGroupElement({
      validateValue: formData.title,
      validateType: ValidateCreateGroupElementBodyValidateTypeEnum.TITLE,
    });

    const priceError = await validateCreateGroupElement({
      validateValue: formData.price,
      validateType: ValidateCreateGroupElementBodyValidateTypeEnum.PRICE,
    });

    const error = titleError || priceError;
    setError(error?.message || null);
    setIsValid(!error && formData.title !== '');
  };

  useEffect(() => {
    fetchMoney();
  }, [fetchMoney]);

  useEffect(() => {
    validateForm();
  }, [formData.title, formData.price]);

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
          setError(error?.message || null);
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
          const error = await validateCreateGroupElement({
            validateValue: value,
            validateType: ValidateCreateGroupElementBodyValidateTypeEnum.PRICE,
          });
          setError(error?.message || null);
        }}
        required
        suffix="원"
      />
      <div className="text-md text-gray-600">
        <p>현재 보유 금액: {moneyData?.toLocaleString()}원</p>
        <p>
          모임 생성 후 잔액: {(moneyData - formData.price).toLocaleString()}원
        </p>
      </div>
    </div>
  );
};
