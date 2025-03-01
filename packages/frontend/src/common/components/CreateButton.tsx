import { useNavigate } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';

export const CreateButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/group/create')}
      className="absolute bottom-24 right-6 w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg z-10"
    >
      <PlusIcon className="w-8 h-8" />
    </button>
  );
};
