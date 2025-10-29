import React, { lazy, Suspense } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import MoodLog from './pages/MoodLog'
const Dashboard = lazy(() => import('./pages/Dashboard'))

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 bg-white border-b">
        <div className="max-w-3xl mx-auto flex items-center justify-between py-3 px-4">
          <div className="text-lg font-semibold">MoodTrackr</div>
          <nav className="flex gap-4 text-sm">
            <NavLink to="/" end className={({isActive}) => isActive ? 'text-indigo-600' : 'text-gray-600'}>Log</NavLink>
            <NavLink to="/dashboard" className={({isActive}) => isActive ? 'text-indigo-600' : 'text-gray-600'}>Dashboard</NavLink>
          </nav>
        </div>
      </header>
      <main className="max-w-3xl mx-auto p-4">
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
  )
}
