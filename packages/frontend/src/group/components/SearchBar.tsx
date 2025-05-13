import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    onSearch(inputValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="relative flex w-full">
      <input
        type="text"
        placeholder="검색..."
        className="w-full rounded-lg border p-3 pr-10 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={inputValue}
      />
      <button
        onClick={handleSubmit}
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
      >
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>
  );
};
