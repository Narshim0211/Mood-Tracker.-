import { lazy, Suspense } from 'react';
import { BrowserRouter, Link, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import './index.css';
import MoodLog from './pages/MoodLog';
import { AppProvider } from './context/AppContext';
import { NotificationToggle } from './components/NotificationToggle';

const Dashboard = lazy(() => import('./pages/Dashboard'));

function Nav() {
  const { pathname } = useLocation();
  const tabClass = (active) =>
    `rounded-md px-3 py-2 text-sm ${active ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900' : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'}`;
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">MoodTrackr</span>
          <nav className="ml-4 flex gap-2">
            <Link className={tabClass(pathname === '/mood')} to="/mood">Log</Link>
            <Link className={tabClass(pathname === '/dashboard')} to="/dashboard">Dashboard</Link>
          </nav>
        </div>
        <NotificationToggle />
      </div>
    </header>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Nav />
        <main className="mx-auto max-w-5xl py-6">
          <Routes>
            <Route path="/" element={<Navigate to="/mood" replace />} />
            <Route path="/mood" element={<MoodLog />} />
            <Route
              path="/dashboard"
              element={
                <Suspense fallback={<div className="p-4 text-sm text-neutral-600 dark:text-neutral-300">Loading dashboard...</div>}>
                  <Dashboard />
                </Suspense>
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </AppProvider>
  );
}
