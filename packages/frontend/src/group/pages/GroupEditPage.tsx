import { useParams } from 'react-router-dom';
import { BaseLayout } from '../../common/BaseLayout';
import { Input } from '../../common/components/Input';
import { XButton } from '../../common/components/XButton';
import { useGroupStore } from '../stores/useGroupStore';

export const GroupEditPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { groupData } = useGroupStore(Number(groupId));

  return (
    <BaseLayout isMainLogo rightElement={<XButton />}>
      <Input
        label="그룹 제목"
        type="text"
        value={groupData?.title || ''}
        name="title"
        onChange={() => {
          console.log('change');
        }}
      />
      <Input
        label="그룹 설명"
        type="text"
        value={groupData?.description || ''}
        name="description"
        onChange={() => {
          console.log('change');
        }}
      />
    </BaseLayout>
  );
};
