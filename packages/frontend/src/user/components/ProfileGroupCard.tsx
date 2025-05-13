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
      className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border px-4 py-6 text-center transition-all hover:border-gray-400 hover:shadow-lg"
      onClick={onClick}
    >
      <div className="text-2xl font-bold">{days}일</div>
      <div>{name}</div>
      {additionalInfo &&
        additionalInfo.map((info, index) => (
          <div key={index} className="mt-1 text-sm text-gray-500">
            {info.label}: {info.value}
          </div>
        ))}
    </div>
  );
};
