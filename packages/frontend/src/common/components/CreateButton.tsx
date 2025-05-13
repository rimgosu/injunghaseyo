import { useNavigate } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';

interface CreateButtonProps {
  path: string;
}

export const CreateButton = ({ path }: CreateButtonProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className="absolute bottom-24 right-6 z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-400 text-2xl text-white shadow-lg"
    >
      <PlusIcon className="h-8 w-8" />
    </button>
  );
};
