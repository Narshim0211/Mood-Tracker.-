import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [userId, setUserId] = useState(() => {
    const saved = localStorage.getItem('moodtrackr:userId');
    if (saved) return saved;
    const id = `user_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem('moodtrackr:userId', id);
    return id;
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => localStorage.getItem('moodtrackr:notifications') === '1');

  useEffect(() => {
    localStorage.setItem('moodtrackr:userId', userId);
  }, [userId]);

  useEffect(() => {
    localStorage.setItem('moodtrackr:notifications', notificationsEnabled ? '1' : '0');
  }, [notificationsEnabled]);

  const value = useMemo(() => ({ userId, setUserId, notificationsEnabled, setNotificationsEnabled }), [userId, notificationsEnabled]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within <AppProvider>');
  return ctx;
}
