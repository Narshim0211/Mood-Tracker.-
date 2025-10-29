import React, { useEffect } from 'react';
import { useUserStore } from '../store/user';

export const NotificationToggle: React.FC = () => {
  const enabled = useUserStore((s) => s.notificationsEnabled);
  const setEnabled = useUserStore((s) => s.setNotificationsEnabled);

  useEffect(() => {
    let interval: number | undefined;
    if (enabled && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
      interval = window.setInterval(() => {
        if (Notification.permission === 'granted') {
          new Notification('MoodTrackr', { body: 'How are you feeling today?' });
        }
      }, 1000 * 60 * 60 * 4); // every 4 hours
    }
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [enabled]);

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => setEnabled(e.target.checked)}
        className="accent-blue-600"
      />
      Enable gentle reminders
    </label>
  );
};
