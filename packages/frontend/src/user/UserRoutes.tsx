import { Routes, Route } from 'react-router-dom';
import { ProfilePage } from './pages/ProfilePage';

export const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
};
