import { BaseLayout } from '../../common/BaseLayout';
import { Input } from '../../common/components/Input';
import { XButton } from '../../common/components/XButton';

export const GroupEditPage = () => {
  return (
    <BaseLayout isMainLogo rightElement={<XButton />}>
      <Input
        label="그룹 제목"
        type="text"
        value="사랑하는 사람들과 함께 하는 그룹"
        name="title"
        onChange={() => {
          console.log('change');
        }}
      />
    </BaseLayout>
  );
};
