import { create } from 'zustand';

interface UserState {
  userId: string;
  setUserId: (id: string) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
}

const initialId = (() => {
  const saved = localStorage.getItem('moodtrackr_userId');
  if (saved) return saved;
  const id = `user_${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem('moodtrackr_userId', id);
  return id;
})();

export const useUserStore = create<UserState>((set) => ({
  userId: initialId,
  notificationsEnabled: localStorage.getItem('moodtrackr_notify') === '1',
  setUserId: (id) => {
    localStorage.setItem('moodtrackr_userId', id);
    set({ userId: id });
  },
  setNotificationsEnabled: (enabled) => {
    localStorage.setItem('moodtrackr_notify', enabled ? '1' : '0');
    set({ notificationsEnabled: enabled });
  },
}));
