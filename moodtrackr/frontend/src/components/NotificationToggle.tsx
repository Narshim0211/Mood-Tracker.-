import React, { useEffect, useState } from 'react';

export function NotificationToggle() {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [permission, setPermission] = useState<NotificationPermission>(Notification.permission);

  useEffect(() => {
    const saved = localStorage.getItem('notif-enabled');
    setEnabled(saved === '1');
  }, []);

  useEffect(() => {
    localStorage.setItem('notif-enabled', enabled ? '1' : '0');
    if (enabled) scheduleReminder();
  }, [enabled]);

  function scheduleReminder() {
    if (permission !== 'granted') return;
    // Simple demo: remind in 2 hours (if the tab stays open)
    window.clearTimeout((window as any).__mood_reminder);
    (window as any).__mood_reminder = window.setTimeout(() => {
      new Notification('MoodTrackr', { body: 'How are you feeling today?' });
    }, 2 * 60 * 60 * 1000);
  }

  async function requestPermission() {
    const p = await Notification.requestPermission();
    setPermission(p);
    if (p === 'granted' && enabled) scheduleReminder();
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Reminders</div>
          <div className="text-sm text-gray-600">Gentle browser nudges to check in.</div>
        </div>
        <div className="flex items-center gap-3">
          {permission !== 'granted' && (
            <button onClick={requestPermission} className="px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300">Allow</button>
          )}
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} />
            <span className="text-sm">Enable</span>
          </label>
        </div>
      </div>
    </div>
  );
}
