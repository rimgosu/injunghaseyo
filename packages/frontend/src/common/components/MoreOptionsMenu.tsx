import React, { useState, useEffect, useRef } from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

export type MoreOptionsMenuOption = {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
};

interface MoreOptionsMenuProps {
  options: MoreOptionsMenuOption[];
  position?: 'right' | 'left';
  className?: string;
  menuClassName?: string;
  iconClassName?: string;
}

export const MoreOptionsMenu: React.FC<MoreOptionsMenuProps> = ({
  options,
  position = 'right',
  className = 'absolute right-0 top-0',
  menuClassName = 'absolute right-0 z-10 mt-1 flex flex-col gap-2 rounded-2xl bg-white p-2 drop-shadow-lg',
  iconClassName = 'h-7 w-7 cursor-pointer text-gray-500',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={className}>
      <div className="relative" ref={menuRef}>
        <EllipsisVerticalIcon
          className={iconClassName}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        />
        {isOpen && (
          <div className={menuClassName}>
            {options.map((option, index) => {
              const Icon = option.icon;
              return (
                <div
                  key={index}
                  className="flex cursor-pointer items-center justify-center gap-1 rounded-2xl px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    option.onClick();
                    setIsOpen(false);
                  }}
                >
                  <Icon className="h-5 w-5 text-gray-500" />
                  <p className="cursor-pointer whitespace-nowrap rounded-2xl px-2 py-1">
                    {option.label}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
