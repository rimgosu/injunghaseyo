import { XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export const TodayGroupTopNavBar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex justify-end p-1">
        <XMarkIcon
          className="w-6 h-6 text-gray-600 cursor-pointer"
          onClick={() => navigate(-1)}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-gray-300 px-4 py-3 text-center">
          인증
        </div>
        <div className="rounded-lg border border-gray-300 px-4 py-3 text-center">
          레벨
        </div>
        <div className="rounded-lg border border-gray-300 px-4 py-3 text-center">
          갤러리
        </div>
      </div>
    </div>
  );
};
