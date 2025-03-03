interface NavigationButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  mode?: 'add' | 'view';
  nextButtonText?: string;
  disabled?: boolean;
}

export const NavigationButtons = ({
  onBack,
  onNext,
  mode = 'add',
  nextButtonText,
  disabled = false,
}: NavigationButtonsProps) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <button onClick={onBack} className="flex items-center text-gray-600">
        <span className="mr-1">←</span> 뒤로
      </button>
      {mode !== 'add' && (
        <button
          onClick={onNext}
          disabled={disabled}
          className={`w-full p-4 rounded-xl ${
            disabled
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-green-400 text-white'
          }`}
        >
          {nextButtonText}
        </button>
      )}
    </div>
  );
};
