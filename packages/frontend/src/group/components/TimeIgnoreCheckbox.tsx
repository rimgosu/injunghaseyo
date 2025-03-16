import React from 'react';

interface TimeIgnoreCheckboxProps {
  isTimeIgnored: boolean;
  onChange: (checked: boolean) => void;
}

export const TimeIgnoreCheckbox: React.FC<TimeIgnoreCheckboxProps> = ({
  isTimeIgnored,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-2 justify-end">
      <input
        type="checkbox"
        id="timeIgnore"
        checked={isTimeIgnored}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 cursor-pointer"
      />
      <label htmlFor="timeIgnore" className="text-base cursor-pointer">
        시간 상관 없음
      </label>
    </div>
  );
};
