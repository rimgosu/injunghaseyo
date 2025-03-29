import { useNavigate, useLocation } from 'react-router-dom';

export const BottomNavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 bg-white flex justify-around items-center">
      <div className="flex justify-around items-center w-full border p-4 rounded-lg">
        <button
          onClick={() => navigate('/gallery')}
          className={`flex flex-col items-center w-1/3 ${
            isActive('/gallery') ? 'text-green-500' : 'text-gray-500'
          }`}
        >
          <span className="text-sm">갤러리</span>
        </button>
        <button
          onClick={() => navigate('/group')}
          className={`flex flex-col items-center w-1/3 ${
            isActive('/group') ? 'text-green-500' : 'text-gray-500'
          }`}
        >
          <span className="text-sm">모임보기</span>
        </button>
        <button
          onClick={() => navigate('/profile')}
          className={`flex flex-col items-center w-1/3 ${
            isActive('/profile') ? 'text-green-500' : 'text-gray-500'
          }`}
        >
          <span className="text-sm">내 정보</span>
        </button>
      </div>
    </div>
  );
};
