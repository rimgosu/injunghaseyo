import { GroupElem } from '@rimgosu/libs';

interface GroupCardProps {
  group: GroupElem;
  onClick: () => void;
}

export const GroupCard = ({ group, onClick }: GroupCardProps) => {
  return (
    <div className="flex rounded-2xl cursor-pointer" onClick={onClick}>
      <div className="flex-2 justify-center items-center pr-4">
        <img
          src={group.groupPhoto}
          alt="group photo"
          className="w-44 rounded-lg"
        />
      </div>
      <div className="flex-1 flex-col gap-1 flex justify-center">
        <div className="text-xl truncate max-w-[300px]">{group.title}</div>
        <div>
          <div className="text-sm text-gray-500 flex gap-1">
            <p>모임 개최일:</p>
            <p>
              {group.startDate} - {group.endDate}
            </p>
          </div>
          <div className="text-sm text-gray-500 flex gap-1">
            <p>참여 인원:</p>
            <p>{group.numberOfParticipants}명</p>
          </div>
        </div>
        <div className="text-lg text-black flex gap-1 font-semibold">
          <p>{group.price.toLocaleString()}원</p>
        </div>
      </div>
    </div>
  );
};
