import { Routes, Route } from 'react-router-dom';
import { ProfilePage } from './pages/ProfilePage';
import { ProfilePhotoPage } from './pages/ProfilePhotoPage';
import { PrivateRoute } from '../common/PrivateRoute';

export const UserRoutes = () => {
  return (
    <Routes>
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/photo"
        element={
          <PrivateRoute>
            <ProfilePhotoPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};
