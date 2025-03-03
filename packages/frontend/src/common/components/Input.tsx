import React, { Component } from 'react';

interface InputProps {
  label: string;
  type: 'text' | 'email' | 'password' | 'number';
  value: string | number;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  suffix?: string | React.ReactNode;
}

export class Input extends Component<InputProps> {
  render() {
    const {
      label,
      type,
      value,
      onChange,
      name,
      placeholder,
      required,
      suffix,
    } = this.props;

    return (
      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm text-gray-600">{label}</label>
        <div className="relative">
          <input
            type={type}
            value={value}
            onChange={onChange}
            name={name}
            placeholder={placeholder}
            required={required}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
          {suffix && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              {suffix}
            </div>
          )}
        </div>
      </div>
    );
  }
}
