interface BaseLayoutProps {
  children: React.ReactNode;
  bottomNavBar?: React.ReactNode;
  bottomButton?: React.ReactNode;
  title?: string;
  rightElement?: React.ReactNode;
}

export const BaseLayout = ({
  children,
  bottomNavBar,
  bottomButton,
  title,
  rightElement,
}: BaseLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="min-h-screen w-full max-w-xl bg-white flex flex-col relative">
        {title && <div className="p-6 text-2xl font-semibold">{title}</div>}
        {rightElement && (
          <div className="absolute top-0 right-0 p-6">{rightElement}</div>
        )}
        <div className="flex-1 flex items-center justify-center overflow-y-auto">
          <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
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
