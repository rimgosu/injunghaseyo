import React from 'react';
import { BottomNavigationBar } from './components/BottomNavigationBar';
import { CreateButton } from './components/CreateButton';

interface BaseLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  showFloatingButton?: boolean;
}

export const BaseLayout = ({
  children,
  showNavigation = false,
  showFloatingButton = false,
}: BaseLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="min-h-screen w-full max-w-xl bg-white flex flex-col relative">
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col gap-4 w-full max-w-md px-4">
            {children}
          </div>
        </div>
        {showFloatingButton && <CreateButton />}
        {showNavigation && <BottomNavigationBar />}
      </div>
    </div>
  );
};
