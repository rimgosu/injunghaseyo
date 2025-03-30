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
    <div className="border rounded-lg px-4 py-6 flex items-center justify-center flex-col gap-1 text-center">
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
