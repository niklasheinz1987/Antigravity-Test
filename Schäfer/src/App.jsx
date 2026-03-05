import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Bestand from './pages/Bestand';
import TierErfassen from './pages/TierErfassen';
import GeburtErfassen from './pages/GeburtErfassen';
import Gesundheit from './pages/Gesundheit';
import Abstammung from './pages/Abstammung';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="bestand" element={<Bestand />} />
          <Route path="neu" element={<TierErfassen />} />
          <Route path="geburt" element={<GeburtErfassen />} />
          <Route path="gesundheit" element={<Gesundheit />} />
          <Route path="abstammung" element={<Abstammung />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
