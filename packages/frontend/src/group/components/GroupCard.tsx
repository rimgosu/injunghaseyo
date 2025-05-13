import { GroupElem, GroupElemJoinStatusEnum } from '@rimgosu/libs';

interface GroupCardProps {
  group: GroupElem;
  onClick: () => void;
}

const joinStatus2Text = (joinStatus: GroupElemJoinStatusEnum) => {
  switch (joinStatus) {
    case GroupElemJoinStatusEnum.RESERVED:
      return '참여 예정';
    case GroupElemJoinStatusEnum.IN_PROGRESS:
      return '참여 중';
    case GroupElemJoinStatusEnum.COMPLETED:
      return '참여 완료';
    case GroupElemJoinStatusEnum.NOT_JOINABLE:
    case GroupElemJoinStatusEnum.NOT_JOINED:
      return null;
  }
};

const joinStatus2Color = (joinStatus: GroupElemJoinStatusEnum) => {
  switch (joinStatus) {
    case GroupElemJoinStatusEnum.RESERVED:
      return 'bg-green-300';
    case GroupElemJoinStatusEnum.IN_PROGRESS:
      return 'bg-blue-300';
    case GroupElemJoinStatusEnum.COMPLETED:
      return 'bg-yellow-300';
    case GroupElemJoinStatusEnum.NOT_JOINABLE:
    case GroupElemJoinStatusEnum.NOT_JOINED:
      return null;
  }
};

export const GroupCard = ({ group, onClick }: GroupCardProps) => {
  return (
    <div className="flex cursor-pointer rounded-2xl" onClick={onClick}>
      <div className="flex-2 relative mr-4 items-center justify-center">
        <div
          className={`absolute bottom-0 w-full rounded-b-3xl p-1 text-center shadow-sm ${joinStatus2Color(group.joinStatus)}`}
        >
          {joinStatus2Text(group.joinStatus)}
        </div>
        <img
          src={group.groupPhoto}
          alt="group photo"
          className="w-44 rounded-3xl"
        />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1">
        <div className="max-w-[300px] truncate text-xl">{group.title}</div>
        <div>
          <div className="flex gap-1 text-sm text-gray-500">
            <p>모임 개최일:</p>
            <p>
              {group.startDate} - {group.endDate}
            </p>
          </div>
          <div className="flex gap-1 text-sm text-gray-500">
            <p>참여 인원:</p>
            <p>{group.numberOfParticipants}명</p>
          </div>
        </div>
        <div className="flex gap-1 text-lg font-semibold text-black">
          <p>{group.price.toLocaleString()}원</p>
        </div>
      </div>
    </div>
  );
};
