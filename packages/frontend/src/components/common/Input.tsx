import React, { Component } from "react";

interface InputProps {
  label: string;
  type: "text" | "email" | "password";
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

export class Input extends Component<InputProps> {
  render() {
    const { label, type, value, onChange, name, placeholder, required } =
      this.props;

    return (
      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm text-gray-600">{label}</label>
        <input
          type={type}
          value={value}
          onChange={onChange}
          name={name}
          placeholder={placeholder}
          required={required}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
        />
      </div>
    );
  }
}
