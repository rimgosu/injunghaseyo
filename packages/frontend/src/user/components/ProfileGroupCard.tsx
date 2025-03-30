interface ProfileGroupCardProps {
  days: number;
  name: string;
  additionalInfo?: {
    label: string;
    value: string | number;
  }[];
}

export const ProfileGroupCard = ({
  days,
  name,
  additionalInfo,
}: ProfileGroupCardProps) => {
  return (
    <div className="border rounded-lg p-4 flex items-center justify-center flex-col gap-1 text-center">
      <div className="text-lg font-bold">{days}일</div>
      <div>{name}</div>
      {additionalInfo &&
        additionalInfo.map((info, index) => (
          <div key={index} className="text-sm text-gray-600 mt-1">
            {info.label}: {info.value}
          </div>
        ))}
    </div>
  );
};
