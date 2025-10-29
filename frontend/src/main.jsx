import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom';
import './index.css';
import App from './pages/App.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
