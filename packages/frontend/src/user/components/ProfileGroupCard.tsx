interface ProfileGroupCardProps {
  days: number;
  name: string;
  onClick?: () => void;
  additionalInfo?: {
    label: string;
    value: string | number;
  }[];
}

export const ProfileGroupCard = ({
  days,
  name,
  onClick,
  additionalInfo,
}: ProfileGroupCardProps) => {
  return (
    <div
      className="border rounded-lg px-4 py-6 flex items-center justify-center flex-col gap-1 text-center transition-all hover:shadow-lg cursor-pointer hover:border-gray-400"
      onClick={onClick}
    >
      <div className="text-2xl font-bold">{days}일</div>
      <div>{name}</div>
      {additionalInfo &&
        additionalInfo.map((info, index) => (
          <div key={index} className="text-sm text-gray-500 mt-1">
            {info.label}: {info.value}
          </div>
        ))}
    </div>
  );
};
