import { create } from 'zustand';
import { submitMood, type MoodLogInput } from '../services/api';

type State = {
  lastTip: string | null;
  logs: Array<{ date: string; emoji: string; scale: number; tip: string; triggers: string[] }>;
  submitMood: (input: MoodLogInput) => Promise<void>;
};

export const useMoodStore = create<State>((set) => ({
  lastTip: null,
  logs: [],
  submitMood: async (input: MoodLogInput) => {
    const res = await submitMood(input);
    set((s) => ({
      lastTip: res.tip,
      logs: [...s.logs, res.mood_log],
    }));
  },
}));
