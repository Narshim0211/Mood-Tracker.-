import { create } from 'zustand';

function defaultUserId() {
  const existing = localStorage.getItem('userId');
  if (existing) return existing;
  const id = 'user-' + Math.random().toString(36).slice(2, 10);
  localStorage.setItem('userId', id);
  return id;
}

export const useUserStore = create((set) => ({
  userId: defaultUserId(),
  setUserId: (userId) => set({ userId }),
}));
