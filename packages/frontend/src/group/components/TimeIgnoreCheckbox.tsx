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
    <div className="flex items-center justify-end gap-2">
      <input
        type="checkbox"
        id="timeIgnore"
        checked={isTimeIgnored}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 cursor-pointer"
      />
      <label htmlFor="timeIgnore" className="cursor-pointer text-base">
        시간 상관 없음
      </label>
    </div>
  );
};
