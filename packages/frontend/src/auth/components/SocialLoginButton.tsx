import React from 'react';

interface SocialLoginButtonProps {
  provider: 'google' | 'kakao' | 'naver';
  icon: string;
  text: string;
  className?: string;
  onClick: (provider: 'google' | 'kakao' | 'naver') => void;
}

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  icon,
  text,
  className,
  onClick,
}) => {
  const baseStyles = 'flex gap-2 px-4 py-3 rounded-lg w-full';

  return (
    <button
      onClick={() => onClick(provider)}
      className={`${baseStyles} ${className}`}
    >
      <img src={icon} alt={provider} className="h-6 w-6" />
      <span>{text}</span>
    </button>
  );
};
