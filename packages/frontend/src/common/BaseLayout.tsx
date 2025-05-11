import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BaseLayoutProps {
  children: React.ReactNode;
  bottomNavBar?: React.ReactNode;
  bottomButton?: React.ReactNode;
  isMainLogo?: boolean;
  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;
  headerElement?: React.ReactNode;
  padding?: string;
  overflowY?: string;
  bgColor?: string;
  height?: string;
}

export const BaseLayout = ({
  children,
  bottomNavBar,
  bottomButton,
  rightElement,
  leftElement,
  headerElement,
  padding = 'p-8',
  overflowY = 'overflow-y-auto',
  bgColor = 'bg-white ',
  height = '',
  isMainLogo = false,
}: BaseLayoutProps) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div
        className={`h-screen w-full max-w-xl flex flex-col relative ${bgColor}`}
      >
        <header>
          {headerElement && <div className="p-6">{headerElement}</div>}
          {isMainLogo && (
            <div
              className="flex items-center p-4 border-b border-gray-200 cursor-pointer"
              onClick={() => navigate('/group')}
            >
              <img
                src="/navbaricon.png"
                alt="navbaricon"
                className="w-10 h-10"
              />
              <p className="text-xl">인증하세요</p>
            </div>
          )}
          {leftElement && (
            <div className="absolute top-0 left-0 p-6">{leftElement}</div>
          )}
          {rightElement && (
            <div className="absolute top-0 right-0 p-6">{rightElement}</div>
          )}
        </header>
        <div
          className={`${overflowY} h-screen flex items-start justify-center ${padding}`}
        >
          <div className={`flex flex-col gap-4 w-full ${height}`}>
            {children}
          </div>
        </div>
        {bottomNavBar && (
          <div className="p-4 fixed bottom-0 left-0 right-0 max-w-xl mx-auto bg-white">
            {bottomNavBar}
          </div>
        )}
        {bottomButton && (
          <div className="p-10 w-full bg-white">{bottomButton}</div>
        )}
      </div>
    </div>
  );
};
