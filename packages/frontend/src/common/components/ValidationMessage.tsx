interface ValidationMessageProps {
  message: string;
}

export const ValidationMessage = ({ message }: ValidationMessageProps) => {
  if (!message) return null;

  return <p className="text-right text-sm text-red-500">{message}</p>;
};
