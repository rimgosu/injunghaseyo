import React from 'react';

interface LikeDisLikeButtonProps {
  isActive: boolean;
  count?: number;
  onClick: () => void;
  ActiveIcon: React.ElementType;
  InactiveIcon: React.ElementType;
  iconClassName?: string;
  showCount?: boolean;
}

const LikeDisLikeButton: React.FC<LikeDisLikeButtonProps> = ({
  isActive,
  count,
  onClick,
  ActiveIcon,
  InactiveIcon,
  iconClassName = '',
  showCount = true,
}) => (
  <div className="flex items-center flex-col">
    {isActive ? (
      <ActiveIcon className={iconClassName} onClick={onClick} />
    ) : (
      <InactiveIcon className={iconClassName} onClick={onClick} />
    )}
    {showCount && <span className="text-white">{count}</span>}
  </div>
);

export default LikeDisLikeButton;
