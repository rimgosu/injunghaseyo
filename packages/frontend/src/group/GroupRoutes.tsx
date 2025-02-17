import { Routes, Route } from 'react-router-dom';
import { GroupPage } from './pages/GroupPage';

export const GroupRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<GroupPage />} />
    </Routes>
  );
};
