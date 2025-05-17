import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { BaseLayout } from '../../common/BaseLayout';
import { Input } from '../../common/components/Input';
import { XButton } from '../../common/components/XButton';
import { useGroupStore } from '../stores/useGroupStore';
import { TagSelector } from '../components/core/TagSelector';
import { useGroups } from '../hooks/useGroups';
import { GreenButton } from '../../auth/components/GreenButton';

interface FormData {
  title: string;
  description: string;
  tags: string[];
  photo: File | null;
  photoPreview: string;
}

export const EditGroupPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { groupData } = useGroupStore(Number(groupId));
  const { getTags, updateGroup } = useGroups();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    tags: [],
    photo: null,
    photoPreview: '',
  });

  const handleUpdateGroup = async () => {
    const res = await updateGroup(
      {
        groupId: Number(groupId),
        title: formData.title,
        description: formData.description,
      },
      formData.photo,
    );

    if (res.data) {
      navigate(`/group/${groupId}`);
    }
  };

  useEffect(() => {
    if (groupData) {
      setFormData({
        title: groupData.title || '',
        description: groupData.description || '',
        tags: groupData.tags || [],
        photo: null,
        photoPreview: groupData.groupPhoto || '',
      });
    }
  }, [groupData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagSelect = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <BaseLayout isMainLogo rightElement={<XButton />}>
      <div className="relative flex flex-col gap-6">
        <div className="relative">
          <img
            src={formData.photoPreview || groupData?.groupPhoto}
            alt="그룹 이미지"
            className="h-48 w-full cursor-pointer rounded-2xl object-cover"
            onClick={handleImageClick}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handlePhotoChange}
          />
        </div>

        <Input
          label="그룹 제목"
          type="text"
          value={formData.title}
          name="title"
          onChange={handleInputChange}
          placeholder="수정할 그룹 제목을 입력해주세요"
        />

        <Input
          label="추가 설명"
          type="text"
          value={formData.description}
          name="description"
          onChange={handleInputChange}
          placeholder="수정할 그룹 설명을 입력해주세요"
        />

        <TagSelector
          selectedTags={formData.tags}
          onTagSelect={handleTagSelect}
          onTagRemove={handleTagRemove}
          getTagsFn={getTags}
        />

        <div className="mt-4">
          <GreenButton
            text="수정 완료"
            onClick={handleUpdateGroup}
            className="py-4 font-semibold"
          />
        </div>
      </div>
    </BaseLayout>
  );
};
