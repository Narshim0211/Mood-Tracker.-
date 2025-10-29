import React, { useEffect, useState } from 'react'

export default function NotificationToggle() {
  const [permission, setPermission] = useState(Notification?.permission || 'default')
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    let interval
    if (enabled && permission === 'granted') {
      interval = setInterval(() => {
        new Notification('MoodTrackr', { body: 'How are you feeling today?' })
      }, 1000 * 60 * 60 * 4) // every 4 hours
    }
    return () => interval && clearInterval(interval)
  }, [enabled, permission])

  const request = async () => {
    if (!('Notification' in window)) return alert('Notifications not supported')
    const result = await Notification.requestPermission()
    setPermission(result)
    if (result === 'granted') setEnabled(true)
  }

  return (
    <div className="card flex items-center justify-between">
      <div>
        <div className="font-medium">Web notifications</div>
        <div className="text-sm text-gray-600">Gentle reminders to check in.</div>
      </div>
      {permission !== 'granted' ? (
        <button className="btn" onClick={request}>Enable</button>
      ) : (
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          <span className="text-sm">{enabled ? 'On' : 'Off'}</span>
        </label>
      )}
    </div>
  )}
