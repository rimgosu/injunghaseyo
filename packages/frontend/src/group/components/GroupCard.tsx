import { GroupElem } from '@rimgosu/libs';

interface GroupCardProps {
  group: GroupElem;
  onClick: () => void;
}

export const GroupCard = ({ group, onClick }: GroupCardProps) => {
  return (
    <div
      className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-lg">{group.title}</h3>
        <div className="text-gray-600 text-sm">
          <div className="flex justify-end">
            가격: {group.price.toLocaleString()}원
          </div>
          <div className="flex justify-end">
            {group.startDate} - {group.endDate}
          </div>
          <div className="flex justify-end">
            파티 참여 인원: {group.numberOfParticipants}명
          </div>
        </div>
      </div>
    </div>
  );
};
