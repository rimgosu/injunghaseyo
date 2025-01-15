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
      className={`border p-4 rounded ${disabled ? 'border-gray-300' : 'border-green-300'}`}
    >
      <button
        className={`w-full text-center py-2 rounded ${
          !disabled
            ? 'text-green-500 hover:text-green-600'
            : 'text-gray-500 cursor-not-allowed'
        } ${className}`}
        onClick={onClick}
        disabled={disabled}
      >
        {text}
      </button>
    </div>
  );
};
