import { Route, Routes } from 'react-router-dom';
import { GalleryPage } from './pages/GalleryPage';
import { ProofPage } from './pages/ProofPage';

export const ProofRoutes = () => {
  return (
    <Routes>
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/:proofId" element={<ProofPage />} />
    </Routes>
  );
};
