import React, { Component } from 'react';

interface InputProps {
  label: string;
  type: 'text' | 'email' | 'password' | 'number';
  value: string | number;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  suffix?: string | React.ReactNode;
  addButton?: {
    onClick: () => void;
    className?: string;
  };
}

export class Input extends Component<InputProps> {
  render() {
    const {
      label,
      type,
      value,
      onChange,
      onKeyPress,
      onKeyDown,
      name,
      placeholder,
      required,
      suffix,
      addButton,
    } = this.props;

    return (
      <div className="flex w-full flex-col gap-1">
        <label className="text-sm text-gray-600">{label}</label>
        <div className="flex items-center">
          <input
            type={type}
            value={value === 0 ? '' : value}
            onChange={onChange}
            onKeyPress={onKeyPress}
            onKeyDown={onKeyDown}
            name={name}
            placeholder={placeholder}
            required={required}
            className="w-full rounded-lg border border-gray-300 p-4 [appearance:textfield] focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          {suffix && (
            <div className="-ml-12 flex-shrink-0 text-gray-500">{suffix}</div>
          )}
          {addButton && (
            <button
              onClick={addButton.onClick}
              className={
                addButton.className ||
                '-ml-10 flex-shrink-0 p-1 text-gray-500 hover:text-gray-700'
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }
}
