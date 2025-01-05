interface ValidationMessageProps {
  message: string;
}

export const ValidationMessage = ({ message }: ValidationMessageProps) => {
  if (!message) return null;

  return <p className="text-red-500 text-sm text-right">{message}</p>;
};
