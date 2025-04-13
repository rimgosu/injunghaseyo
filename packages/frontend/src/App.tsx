import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './AppRoutes';
import { usePasswordChanged } from './setting/stores/usePasswordChanged';
import { PasswordChangeSuccessModal } from './setting/components/PasswordChangeSuccessModal';
function App() {
  const { passwordChanged } = usePasswordChanged();

  return (
    <BrowserRouter>
      <AppRoutes />
      {passwordChanged && <PasswordChangeSuccessModal />}
    </BrowserRouter>
  );
}

export default App;
