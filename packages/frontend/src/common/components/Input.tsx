import React, { Component } from 'react';

interface InputProps {
  label: string;
  type: 'text' | 'email' | 'password' | 'number';
  value: string | number;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
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
      name,
      placeholder,
      required,
      suffix,
      addButton,
    } = this.props;

    return (
      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm text-gray-600">{label}</label>
        <div className="flex items-center">
          <input
            type={type}
            value={value === 0 ? '' : value}
            onChange={onChange}
            onKeyPress={onKeyPress}
            name={name}
            placeholder={placeholder}
            required={required}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {suffix && (
            <div className="flex-shrink-0 -ml-12 text-gray-500">{suffix}</div>
          )}
          {addButton && (
            <button
              onClick={addButton.onClick}
              className={
                addButton.className ||
                'flex-shrink-0 -ml-10 p-1 text-gray-500 hover:text-gray-700'
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
