import { GroupElem } from '@rimgosu/libs';

interface GroupCardProps {
  group: GroupElem;
}

export const GroupCard = ({ group }: GroupCardProps) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-lg">{group.title}</h3>
        <div className="text-sm text-gray-600">
          <div>가격: {group.price.toLocaleString()}원</div>
          <div>모임 계획일: {group.startDate}</div>
          <div>기간: {group.endDate}</div>
          <div>파티 참여 인원: {group.numberOfParticipants}명</div>
        </div>
      </div>
    </div>
  );
};
