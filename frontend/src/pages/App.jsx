import React, { Suspense, lazy, useEffect, useState } from 'react';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import MoodLog from './MoodLog.jsx';

const Dashboard = lazy(() => import('./Dashboard.jsx'));

export default function App() {
  const [notifEnabled, setNotifEnabled] = useState(
    localStorage.getItem('notifEnabled') === 'true'
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (notifEnabled && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
      const interval = setInterval(() => {
        if (Notification.permission === 'granted') {
          new Notification('MoodTrackr', { body: 'How are you feeling today?' });
        }
      }, 1000 * 60 * 60 * 4); // every 4 hours
      return () => clearInterval(interval);
    }
  }, [notifEnabled]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">MoodTrackr</h1>
        <div className="flex items-center gap-2">
          <NavLink className="btn btn-ghost" to="/">Log</NavLink>
          <NavLink className="btn btn-ghost" to="/dashboard">Dashboard</NavLink>
          <label className="flex items-center gap-2 text-sm ml-4">
            <input
              type="checkbox"
              checked={notifEnabled}
              onChange={(e) => {
                const v = e.target.checked;
                setNotifEnabled(v);
                localStorage.setItem('notifEnabled', String(v));
              }}
            />
            Notifications
          </label>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<MoodLog />} />
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<div>Loading dashboard…</div>}>
                <Dashboard />
              </Suspense>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
