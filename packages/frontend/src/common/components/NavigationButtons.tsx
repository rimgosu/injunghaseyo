interface NavigationButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  mode?: 'add' | 'view';
  nextButtonText?: string;
}

export const NavigationButtons = ({
  onBack,
  onNext,
  mode = 'add',
  nextButtonText,
}: NavigationButtonsProps) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <button onClick={onBack} className="flex items-center text-gray-600">
        <span className="mr-1">←</span> 뒤로
      </button>
      {mode !== 'add' && (
        <button
          onClick={onNext}
          className="w-full p-4 bg-green-400 text-white rounded-xl"
        >
          {nextButtonText}
        </button>
      )}
    </div>
  );
};
