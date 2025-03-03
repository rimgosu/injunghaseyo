interface BaseLayoutProps {
  children: React.ReactNode;
  bottomElement?: React.ReactNode;
  title?: string; // 추가된 prop
}

export const BaseLayout = ({
  children,
  bottomElement,
  title,
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
        {bottomElement && <div className="p-14 mb-10">{bottomElement}</div>}
      </div>
    </div>
  );
};
