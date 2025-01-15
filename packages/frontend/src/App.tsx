import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import './styles/globals.css';
import { store } from './store';
import { AuthRoutes } from './auth/AuthRoutes';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
