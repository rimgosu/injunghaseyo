interface GreenButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const GreenButton = ({
  text,
  onClick,
  disabled = false,
  className = '',
}: GreenButtonProps) => {
  return (
    <div
      className={`rounded-xl border p-2 ${disabled ? 'border-gray-300' : 'border-green-300'}`}
    >
      <button
        className={`w-full rounded py-2 text-center ${
          !disabled
            ? 'text-green-600 hover:text-green-600'
            : 'cursor-not-allowed text-gray-500'
        } ${className}`}
        onClick={onClick}
        disabled={disabled}
      >
        {text}
      </button>
    </div>
  );
};
