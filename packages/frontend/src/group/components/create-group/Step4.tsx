import { useState, useEffect } from 'react';
import { useGroups } from '../../hooks/useGroups';
import { useCreateGroupStore } from '../../stores/useCreateGroupStore';
import { useUsers } from '../../../user/hooks/useUsers';
import { Input } from '../../../common/components/Input';
import { Tag } from '../Tag';

export const CreateGroupStep4 = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [availableTags, setAvailableTags] = useState<string[] | null>(null);
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

  useEffect(() => {
    const fetchTags = async () => {
      const response = await getTags({
        tagSearch: searchQuery,
        selectedTags: formData.tags,
      });
      if (response.data) {
        setAvailableTags(response.data.tags ?? []);
      }
    };
    fetchTags();
  }, [searchQuery, formData.tags]);

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

  const handleAddTag = () => {
    if (searchQuery.trim()) {
      handleTagSelect(searchQuery.trim());
      setSearchQuery(''); // 입력 후 검색어 초기화
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 선택된 태그 표시 영역 */}
      <div className="flex flex-wrap gap-2">
        {formData.tags?.map((tag) => (
          <div
            key={tag}
            className="flex items-center gap-1 px-6 py-2 bg-green-100 text-green-700 rounded-full"
          >
            <span>{tag}</span>
            <button
              onClick={() => handleTagRemove(tag)}
              className="text-green-700 hover:text-green-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* 태그 검색 입력창 */}
      <div className="relative">
        <Input
          label="태그 검색"
          type="text"
          value={searchQuery}
          name="tagSearch"
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="태그를 추가하세요"
          addButton={{
            onClick: handleAddTag,
          }}
        />
      </div>

      {/* 검색된 태그 목록 */}
      <div className="flex flex-wrap gap-2">
        {availableTags?.map((tag) => (
          <Tag tag={tag} onClick={() => handleTagSelect(tag)} />
        ))}
      </div>

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
