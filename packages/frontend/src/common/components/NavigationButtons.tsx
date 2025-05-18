import { GreenButton } from '../../auth/components/GreenButton';

interface NavigationButtonsProps {
  onNext: () => void;
  onBack?: () => void;
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
    <div className="flex w-full flex-col gap-4">
      <button onClick={onBack} className="flex items-center text-gray-600">
        <span className="mr-1">←</span> 뒤로
      </button>
      {mode !== 'add' && (
        <GreenButton
          text={nextButtonText || ''}
          onClick={onNext}
          disabled={disabled}
          className="w-full rounded-xl p-4"
        />
      )}
    </div>
  );
};
