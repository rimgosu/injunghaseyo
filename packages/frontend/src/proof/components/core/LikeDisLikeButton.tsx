import React from 'react';

interface LikeDisLikeButtonProps {
  isActive: boolean;
  count?: number;
  onClick: () => void;
  ActiveIcon: React.ElementType;
  InactiveIcon: React.ElementType;
  iconClassName?: string;
  showCount?: boolean;
  countIconClassName?: string;
  flexDirection?: 'flex-row' | 'flex-col';
}

export const LikeDisLikeButton: React.FC<LikeDisLikeButtonProps> = ({
  isActive,
  count,
  onClick,
  ActiveIcon,
  InactiveIcon,
  iconClassName = '',
  showCount = true,
  countIconClassName = 'text-white',
  flexDirection = 'flex-col',
}) => (
  <div className={`flex items-center ${flexDirection}`}>
    {isActive ? (
      <ActiveIcon className={iconClassName} onClick={onClick} />
    ) : (
      <InactiveIcon className={iconClassName} onClick={onClick} />
    )}
    {showCount && (
      <span className={`${countIconClassName} drop-shadow-lg`}>{count}</span>
    )}
  </div>
);
