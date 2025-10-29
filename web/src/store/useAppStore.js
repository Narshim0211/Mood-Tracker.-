import { create } from 'zustand'

export const useAppStore = create((set, get) => ({
  userId: 'demo-user',
  moodLog: { emoji: '😐', scale: 5, tip: '', triggers: [] },
  lastResponse: null,
  setEmoji: (emoji) => set((s) => ({ moodLog: { ...s.moodLog, emoji } })),
  setScale: (scale) => set((s) => ({ moodLog: { ...s.moodLog, scale } })),
  setLastResponse: (lastResponse) => set({ lastResponse }),
}))
