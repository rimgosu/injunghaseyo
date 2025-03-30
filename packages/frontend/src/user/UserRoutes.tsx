import { Routes, Route } from 'react-router-dom';
import { ProfilePage } from './pages/ProfilePage';
import { ProfilePhotoPage } from './pages/ProfilePhotoPage';

export const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/photo" element={<ProfilePhotoPage />} />
    </Routes>
  );
};
