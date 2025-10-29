import React, { createContext, useContext, useEffect, useState } from 'react';

const NotificationCtx = createContext<{ enabled: boolean; toggle: () => void }>({ enabled: false, toggle: () => {} });

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState<boolean>(() => localStorage.getItem('notif-enabled') === '1');

  useEffect(() => {
    localStorage.setItem('notif-enabled', enabled ? '1' : '0');
    if (enabled) {
      if ('Notification' in window) {
        Notification.requestPermission().then((perm) => {
          if (perm === 'granted') {
            // simple reminder in 4 hours
            const ms = 4 * 60 * 60 * 1000;
            window.setTimeout(() => {
              try {
                // eslint-disable-next-line no-new
                new Notification('MoodTrackr', { body: 'How are you feeling today?' });
              } catch {
                // ignore
              }
            }, ms);
          }
        });
      }
    }
  }, [enabled]);

  const toggle = () => setEnabled((v) => !v);

  return <NotificationCtx.Provider value={{ enabled, toggle }}>{children}</NotificationCtx.Provider>;
}

export function useNotification() {
  return useContext(NotificationCtx);
}
