import { XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

interface XButtonProps {
  textColor?: string;
}

export const XButton = ({ textColor = 'text-gray-600' }: XButtonProps) => {
  const navigate = useNavigate();
  return (
    <XMarkIcon
      className={`h-6 w-6 ${textColor} cursor-pointer`}
      onClick={() => navigate(-1)}
    />
  );
};
