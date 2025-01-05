import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div className="min-h-screen w-full max-w-xl bg-white flex items-center justify-center">
      {children}
    </div>
  </div>
);
