import { useState, useEffect } from 'react';
import { GroupControllerGetTagsParams, GetTagsRes } from '@rimgosu/libs';
import { Input } from '../../../common/components/Input';
import { Tag } from '../Tag';
import { ApiResponse } from '../../../common/types';

interface SelectedTagProps {
  tag: string;
  onRemove: (tag: string) => void;
}

const SelectedTag = ({ tag, onRemove }: SelectedTagProps) => {
  return (
    <div
      key={tag}
      className="flex items-center gap-1 rounded-full bg-green-100 px-6 py-2 text-green-700"
    >
      <span>{tag}</span>
      <button
        onClick={() => onRemove(tag)}
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
  );
};

interface TagSelectorProps {
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onTagRemove: (tag: string) => void;
  getTagsFn: (
    query: GroupControllerGetTagsParams,
  ) => Promise<ApiResponse<GetTagsRes>>;
}

export const TagSelector = ({
  selectedTags,
  onTagSelect,
  onTagRemove,
  getTagsFn,
}: TagSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [availableTags, setAvailableTags] = useState<string[] | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      const response = await getTagsFn({
        tagSearch: searchQuery,
        selectedTags: selectedTags,
      });
      if (response.data) {
        setAvailableTags(response.data.tags ?? []);
      }
    };
    fetchTags();
  }, [searchQuery, selectedTags, getTagsFn]);

  const handleAddTag = () => {
    if (searchQuery.trim()) {
      onTagSelect(searchQuery.trim());
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
        {selectedTags?.map((tag) => (
          <SelectedTag key={tag} tag={tag} onRemove={onTagRemove} />
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
          <Tag key={tag} tag={tag} onClick={() => onTagSelect(tag)} />
        ))}
      </div>
    </div>
  );
};
