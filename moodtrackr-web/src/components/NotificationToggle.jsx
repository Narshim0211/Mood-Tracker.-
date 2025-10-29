import { Button } from './ui/Button';
import { useApp } from '../context/AppContext';

export function NotificationToggle() {
  const { notificationsEnabled, setNotificationsEnabled } = useApp();

  async function enable() {
    if (!('Notification' in window)) return alert('Notifications not supported in this browser.');
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      setNotificationsEnabled(true);
      new Notification('MoodTrackr', { body: 'Notifications enabled. We got you!' });
    }
  }

  function disable() {
    setNotificationsEnabled(false);
  }

  return notificationsEnabled ? (
    <Button variant="outline" onClick={disable}>Disable reminders</Button>
  ) : (
    <Button onClick={enable}>Enable reminders</Button>
  );
}
