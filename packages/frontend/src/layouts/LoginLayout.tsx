import React from "react";

interface LoginLayoutProps {
  children: React.ReactNode;
}

export const LoginLayout = ({ children }: LoginLayoutProps) => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div className="min-h-screen w-full max-w-xl bg-white flex">{children}</div>
  </div>
);
