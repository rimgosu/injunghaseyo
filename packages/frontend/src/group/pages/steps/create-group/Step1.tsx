import { Input } from '../../../../common/components/Input';

export const CreateGroupStep1 = () => {
  return (
    <div>
      <Input
        label="모임 제목"
        type="text"
        value=""
        name="모임 제목"
        onChange={(e) => {
          console.log(e.target.value);
        }}
        required
      />
    </div>
  );
};
