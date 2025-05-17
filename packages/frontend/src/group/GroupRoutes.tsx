import { Routes, Route } from 'react-router-dom';
import { GroupPage } from './pages/GroupPage';
import { CreateGroupFlow } from './pages/CreateGroupFlow';
import { GroupDetailPage } from './pages/GroupDetailPage';
import { GroupTodayPage } from './pages/GroupTodayPage';
import { PrivateRoute } from '../common/PrivateRoute';
import { GroupEditPage } from './pages/GroupEditPage';

export const GroupRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<GroupPage />} />
      <Route
        path="/create"
        element={
          <PrivateRoute>
            <CreateGroupFlow />
          </PrivateRoute>
        }
      />
      <Route path="/:groupId" element={<GroupDetailPage />} />
      <Route
        path="/:groupId/today"
        element={
          <PrivateRoute>
            <GroupTodayPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/:groupId/edit"
        element={
          <PrivateRoute>
            <GroupEditPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};
