import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/globals.css';
import { store } from './store';
import { AuthRoutes } from './auth/AuthRoutes';
import { GroupRoutes } from './group/GroupRoutes';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/*" element={<AuthRoutes />} />
          <Route path="/group/*" element={<GroupRoutes />} />
          <Route path="/" element={<Navigate to="/auth/init" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
