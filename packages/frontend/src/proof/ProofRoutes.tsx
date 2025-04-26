import { Route, Routes } from 'react-router-dom';
import { GalleryPage } from './pages/GalleryPage';

export const ProofRoutes = () => {
  return (
    <Routes>
      <Route path="/gallery" element={<GalleryPage />} />
    </Routes>
  );
};
