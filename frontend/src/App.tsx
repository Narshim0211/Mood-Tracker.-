import { Suspense, lazy } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import MoodLog from './pages/MoodLog';
import { NotificationProvider, useNotification } from './context/NotificationContext';

const Dashboard = lazy(() => import('./pages/Dashboard'));

function Header() {
  const { enabled, toggle } = useNotification();
  return (
    <header className="w-full border-b bg-white/70 dark:bg-zinc-900 backdrop-blur supports-[backdrop-filter]:bg-white/40">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/" className="hover:underline">Mood Log</Link>
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        </nav>
        <button onClick={toggle} className="text-xs px-2 py-1 rounded border">
          {enabled ? 'Notifications: On' : 'Notifications: Off'}
        </button>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
          <Header />
          <main className="py-6">
            <Suspense fallback={<div className="p-4">Loading...</div>}>
              <Routes>
                <Route path="/" element={<MoodLog />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </BrowserRouter>
    </NotificationProvider>
  );
}
