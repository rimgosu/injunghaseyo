import { useNavigate, useLocation } from 'react-router-dom';
import { useCheckSignInStore } from '../../auth/stores/useCheckSignInStore';

export const BottomNavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn } = useCheckSignInStore();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const handleProfileClick = () => {
    if (!isSignedIn) {
      navigate('/auth/login');
      return;
    }
    navigate('/user/profile');
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-around bg-white p-6">
      <div className="flex w-full items-center justify-around rounded-lg border p-4">
        <button
          onClick={() => navigate('/proof/gallery')}
          className={`flex w-1/3 flex-col items-center ${
            isActive('/proof/gallery') ? 'text-green-500' : 'text-gray-500'
          }`}
        >
          <span className="text-sm">갤러리</span>
        </button>
        <button
          onClick={() => navigate('/group')}
          className={`flex w-1/3 flex-col items-center ${
            isActive('/group') ? 'text-green-500' : 'text-gray-500'
          }`}
        >
          <span className="text-sm">모임보기</span>
        </button>
        <button
          onClick={handleProfileClick}
          className={`flex w-1/3 flex-col items-center ${
            isActive('/user/profile') ? 'text-green-500' : 'text-gray-500'
          }`}
        >
          <span className="text-sm">내 정보</span>
        </button>
      </div>
    </div>
  );
};
