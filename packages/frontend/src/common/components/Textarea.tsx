import React, { Component } from 'react';

interface TextareaProps {
  label: string;
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  suffix?: string | React.ReactNode;
  addButton?: {
    onClick: () => void;
    className?: string;
  };
}

export class Textarea extends Component<TextareaProps> {
  handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 엔터키가 눌렸을 때 기본 동작(줄바꿈) 허용
    if (e.key === 'Enter') {
      // 기본 동작을 막지 않음 (줄바꿈 허용)
    }

    // 부모 컴포넌트에서 전달한 onKeyDown 핸들러가 있다면 실행
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  };

  render() {
    const {
      label,
      value,
      onChange,
      onKeyPress,
      name,
      placeholder,
      required,
      rows = 4,
      suffix,
      addButton,
    } = this.props;

    return (
      <div className="flex w-full flex-col gap-1">
        <label className="text-sm text-gray-600">{label}</label>
        <div className="flex items-start">
          <textarea
            value={value}
            onChange={onChange}
            onKeyPress={onKeyPress}
            onKeyDown={this.handleKeyDown}
            name={name}
            placeholder={placeholder}
            required={required}
            rows={rows}
            className="w-full resize-none rounded-lg border border-gray-300 p-4 scrollbar-hide focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          {suffix && (
            <div className="-ml-12 mt-4 flex-shrink-0 text-gray-500">
              {suffix}
            </div>
          )}
          {addButton && (
            <button
              onClick={addButton.onClick}
              className={
                addButton.className ||
                '-ml-10 mt-3 flex-shrink-0 p-1 text-gray-500 hover:text-gray-700'
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
