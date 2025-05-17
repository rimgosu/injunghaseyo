import { useState, useEffect } from 'react';
import { useGroups } from '../../hooks/useGroups';
import { useCreateGroupStore } from '../../stores/useCreateGroupStore';
import { useUsers } from '../../../user/hooks/useUsers';
import { TagSelector } from '../core/TagSelector';

export const CreateGroupStep4 = () => {
  const [moneyData, setMoneyData] = useState<number>(0);
  const { getTags } = useGroups();
  const { formData, updateFormData } = useCreateGroupStore();
  const { fetchMoney } = useUsers();

  useEffect(() => {
    const fetchMoneyData = async () => {
      const res = await fetchMoney();
      res.data && setMoneyData(res.data.money);
    };
    fetchMoneyData();
  }, [fetchMoney]);

  const handleTagSelect = (tag: string) => {
    if (!formData.tags?.includes(tag)) {
      updateFormData({ tags: [...(formData.tags ?? []), tag] });
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    updateFormData({
      tags: formData.tags?.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <TagSelector
        selectedTags={formData.tags || []}
        onTagSelect={handleTagSelect}
        onTagRemove={handleTagRemove}
        getTagsFn={getTags}
      />

      {/* 잔액 정보 표시 */}
      <div className="text-md text-gray-600">
        <p>현재 보유 금액: {moneyData?.toLocaleString()}원</p>
        <p>
          모임 생성 후 잔액: {(moneyData - formData.price).toLocaleString()}원
        </p>
      </div>
    </div>
  );
};
