import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/globals.css';
import { AuthRoutes } from './auth/AuthRoutes';
import { GroupRoutes } from './group/GroupRoutes';
import { UserRoutes } from './user/UserRoutes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="/group/*" element={<GroupRoutes />} />
        <Route path="/user/*" element={<UserRoutes />} />
        <Route path="/" element={<Navigate to="/group" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
