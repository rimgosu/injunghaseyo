import { Routes, Route } from 'react-router-dom';
import { GroupPage } from './pages/GroupPage';
import { CreateGroupFlow } from './pages/CreateGroupFlow';
import { GroupDetailPage } from './pages/GroupDetailPage';
import { GroupTodayPage } from './pages/GroupTodayPage';

export const GroupRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<GroupPage />} />
      <Route path="/create" element={<CreateGroupFlow />} />
      <Route path="/:groupId" element={<GroupDetailPage />} />
      <Route path="/:groupId/today" element={<GroupTodayPage />} />
    </Routes>
  );
};
