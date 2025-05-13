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
  searchBar?: React.ReactNode;
  bottomLine?: boolean;
}

export const BaseLayout = ({
  children,
  bottomNavBar,
  bottomButton,
  rightElement,
  leftElement,
  headerElement,
  searchBar,
  padding = 'p-8',
  overflowY = 'overflow-y-auto',
  bgColor = 'bg-white ',
  height = '',
  bottomLine = true,
  isMainLogo = false,
}: BaseLayoutProps) => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div
        className={`relative flex h-screen w-full max-w-xl flex-col ${bgColor}`}
      >
        <header
          className={`${bottomLine && 'border-b'} flex items-center border-gray-200 ${isMainLogo && 'p-4'}`}
        >
          {headerElement && <div className="w-full p-6">{headerElement}</div>}
          {isMainLogo && (
            <div
              className="flex w-1/3 cursor-pointer items-center border-gray-200"
              onClick={() => navigate('/group')}
            >
              <img
                src="/navbaricon.png"
                alt="navbaricon"
                className="h-10 w-10"
              />
              <p className="text-xl">인증하세요</p>
            </div>
          )}
          {searchBar && (
            <div className="flex w-2/3 justify-center pr-4">{searchBar}</div>
          )}
          {leftElement && (
            <div className="absolute left-0 top-0 p-6">{leftElement}</div>
          )}
          {rightElement && (
            <div className="absolute right-0 top-0 p-6">{rightElement}</div>
          )}
        </header>
        <div
          className={`${overflowY} flex h-screen items-start justify-center ${padding} scrollbar-hide`}
        >
          <div className={`flex w-full flex-col gap-4 ${height}`}>
            {children}
          </div>
        </div>
        {bottomNavBar && (
          <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-xl bg-white p-4">
            {bottomNavBar}
          </div>
        )}
        {bottomButton && (
          <div className="w-full bg-white p-10">{bottomButton}</div>
        )}
      </div>
    </div>
  );
};
