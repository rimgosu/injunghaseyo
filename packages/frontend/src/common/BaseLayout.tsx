import React from 'react';

export const BaseLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div className="min-h-screen w-full max-w-xl bg-white flex items-center justify-center">
      <div className="flex flex-col gap-4 w-full max-w-md">{children}</div>
    </div>
  </div>
);
