import React from 'react';

interface BaseLayoutProps {
  children: React.ReactNode;
  bottomNavBar?: React.ReactNode;
  bottomButton?: React.ReactNode;
  title?: string;
  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;
  headerElement?: React.ReactNode;
  padding?: string;
}

export const BaseLayout = ({
  children,
  bottomNavBar,
  bottomButton,
  title,
  rightElement,
  leftElement,
  headerElement,
  padding = 'p-8',
}: BaseLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="min-h-screen w-full max-w-xl bg-white flex flex-col relative">
        {headerElement && <div className="p-6">{headerElement}</div>}
        {title && <div className="p-6 text-2xl font-semibold">{title}</div>}
        {leftElement && (
          <div className="absolute top-0 left-0 p-6">{leftElement}</div>
        )}
        {rightElement && (
          <div className="absolute top-0 right-0 p-6">{rightElement}</div>
        )}
        <div className="flex-1 h-full overflow-y-auto">
          <div className={`flex flex-col gap-4 w-full h-full ${padding}`}>
            {children}
          </div>
        </div>
        {bottomNavBar && (
          <div className="p-4 fixed bottom-0 left-0 right-0 max-w-xl mx-auto bg-white">
            {bottomNavBar}
          </div>
        )}
        {bottomButton && (
          <div className="mb-16 p-10 w-full bg-white">{bottomButton}</div>
        )}
      </div>
    </div>
  );
};
