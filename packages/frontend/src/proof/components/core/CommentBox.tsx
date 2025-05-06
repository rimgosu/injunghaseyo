import { useState } from 'react';

export const CommentBox = () => {
  const [focused, setFocused] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-1">
      <input
        type="text"
        className="flex-1 w-full border-b border-gray-400 focus:outline-none focus:border-black"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {focused && (
        <div className="flex justify-end gap-2 text-lg">
          <p className="text-gray-500 hover:bg-gray-100 p-2 px-4 rounded-3xl cursor-pointer">
            취소
          </p>
          <p className="text-gray-500 bg-gray-300 p-2 px-4 rounded-3xl cursor-pointer">
            댓글
          </p>
        </div>
      )}
    </div>
  );
};
