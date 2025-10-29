import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { MoodLogPage } from './pages/MoodLogPage';
import { NotificationToggle } from './components/NotificationToggle';

const Dashboard = React.lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <header className="border-b bg-white">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="font-semibold">MoodTrackr</div>
            <nav className="flex items-center gap-4 text-sm">
              <NavLink to="/" className={({ isActive }) => (isActive ? 'text-blue-600' : 'text-gray-600')}>Log</NavLink>
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'text-blue-600' : 'text-gray-600')}>Dashboard</NavLink>
              <NotificationToggle />
            </nav>
          </div>
        </header>
        <main className="flex-1">
          <Suspense fallback={<div className="p-6">Loading...</div>}>
            <Routes>
              <Route path="/" element={<MoodLogPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
