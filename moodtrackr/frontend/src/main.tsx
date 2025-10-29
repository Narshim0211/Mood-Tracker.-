import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './styles/index.css';
import App from './pages/App';
import Dashboard from './pages/Dashboard';

function Layout() {
  return (
    <div>
      <header className="bg-white shadow">
        <nav className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-semibold text-lg">MoodTrackr</Link>
          <div className="space-x-4">
            <Link to="/" className="text-sm text-gray-700 hover:text-blue-600">Log Mood</Link>
            <Link to="/dashboard" className="text-sm text-gray-700 hover:text-blue-600">Dashboard</Link>
            <a href="/docs" className="text-sm text-gray-700 hover:text-blue-600">API Docs</a>
          </div>
        </nav>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </React.StrictMode>
);
