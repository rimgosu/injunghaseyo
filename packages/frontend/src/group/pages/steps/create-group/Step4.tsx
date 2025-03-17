import { useState, useEffect } from 'react';
import { useGroups } from '../../../hooks/useGroups';
import { useCreateGroupStore } from '../../../stores/useCreateGroupStore';
import { Input } from '../../../../common/components/Input';

export const CreateGroupStep4 = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const { getTags } = useGroups();
  const { formData, updateFormData } = useCreateGroupStore();

  useEffect(() => {
    const fetchTags = async () => {
      const response = await getTags({
        tagSearch: searchQuery,
        selectedTags: formData.tags,
      });
      if (response.data) {
        setAvailableTags(response.data.tags);
      }
    };
    fetchTags();
  }, [searchQuery, formData.tags]);

  const handleTagSelect = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      updateFormData({ tags: [...formData.tags, tag] });
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    updateFormData({
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 선택된 태그 표시 영역 */}
      <div className="flex flex-wrap gap-2">
        {formData.tags.map((tag) => (
          <div
            key={tag}
            className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full"
          >
            <span>{tag}</span>
            <button
              onClick={() => handleTagRemove(tag)}
              className="text-green-700 hover:text-green-900"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* 태그 검색 입력창 */}
      <Input
        label="태그 검색"
        type="text"
        value={searchQuery}
        name="tagSearch"
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="태그를 검색하세요"
      />

      {/* 검색된 태그 목록 */}
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagSelect(tag)}
            className="px-3 py-1 border border-gray-300 rounded-full hover:bg-gray-100"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};
