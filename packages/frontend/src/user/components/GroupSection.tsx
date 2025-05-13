import { ProfileGroupCard } from './ProfileGroupCard';

interface GroupSectionProps {
  title: string;
  groups: Array<{
    id: number;
    proofDays: number;
    name: string;
  }>;
  onGroupClick: (groupId: number) => void;
  gridCols?: number;
  className?: string;
}

export const GroupSection = ({
  title,
  groups,
  onGroupClick,
  gridCols = 2,
  className = '',
}: GroupSectionProps) => {
  return (
    <div className={className}>
      <h2 className="mb-2 text-xl">{title}</h2>
      <div className={`grid grid-cols-${gridCols} gap-4`}>
        {groups.length === 0 ? (
          <div className="text-lg text-gray-500">{title}이 없습니다.</div>
        ) : (
          groups.map((group, index) => (
            <ProfileGroupCard
              key={index}
              days={group.proofDays}
              name={group.name}
              onClick={() => onGroupClick(group.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
