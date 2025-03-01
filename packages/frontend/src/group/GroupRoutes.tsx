import { Routes, Route } from 'react-router-dom';
import { GroupPage } from './pages/GroupPage';
import { CreateGroupFlow } from './pages/CreateGroupFlow';

export const GroupRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<GroupPage />} />
      <Route path="/create" element={<CreateGroupFlow />} />
    </Routes>
  );
};
