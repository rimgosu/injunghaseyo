import { XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export const XButton = () => {
  const navigate = useNavigate();
  return (
    <XMarkIcon
      className="w-6 h-6 text-gray-600 cursor-pointer"
      onClick={() => navigate(-1)}
    />
  );
};
