import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './AppRoutes';
import { usePasswordChanged } from './setting/stores/usePasswordChanged';
import { useEffect } from 'react';
import { PasswordChangeSuccessModal } from './setting/components/PasswordChangeSuccessModal';
function App() {
  const { passwordChanged } = usePasswordChanged();
  useEffect(() => {
    console.log('passwordChanged', passwordChanged);
  }, [passwordChanged]);

  return (
    <BrowserRouter>
      <AppRoutes />
      {passwordChanged && <PasswordChangeSuccessModal />}
    </BrowserRouter>
  );
}

export default App;
