import { BottomNavigationBar } from './components/BottomNavigationBar';
import { CreateButton } from './components/CreateButton';

interface BaseLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  showFloatingButton?: boolean;
  navigationButtons?: React.ReactNode; // 추가된 prop
  title?: string; // 추가된 prop
}

export const BaseLayout = ({
  children,
  showNavigation = false,
  showFloatingButton = false,
  navigationButtons, // 추가된 prop
  title, // 추가된 prop
}: BaseLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="min-h-screen w-full max-w-xl bg-white flex flex-col relative gap-6">
        {title && <div className="p-6 text-2xl font-semibold">{title}</div>}
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col gap-4 w-full max-w-md px-4">
            {children}
          </div>
        </div>
        {navigationButtons && (
          <div className="p-14 mb-10">{navigationButtons}</div>
        )}
        {showFloatingButton && <CreateButton />}
        {showNavigation && <BottomNavigationBar />}
      </div>
    </div>
  );
};
