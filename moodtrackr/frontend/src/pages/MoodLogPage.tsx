import React, { useState } from 'react';
import { EmojiGrid } from '../components/EmojiGrid';
import { MoodSlider } from '../components/MoodSlider';
import { TipCard } from '../components/TipCard';
import { postJson } from '../api/client';
import { useUserStore } from '../store/user';

interface MoodResponse {
  log: { date: string; emoji: string; scale: number; triggers: string[]; tip: string };
  triggers: string[];
  tip: string;
}

export const MoodLogPage: React.FC = () => {
  const userId = useUserStore((s) => s.userId);
  const [emoji, setEmoji] = useState('😊');
  const [scale, setScale] = useState(5);
  const [customTrigger, setCustomTrigger] = useState('');
  const [tip, setTip] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      const res = await postJson<MoodResponse>('/mood', { userId, emoji, scale, customTrigger });
      setTip(res.tip);
      setCustomTrigger('');
    } catch (e) {
      console.error(e);
      alert('Failed to submit mood.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">How are you feeling?</h1>
      <div className="space-y-6 rounded-lg border bg-white p-4 shadow-sm">
        <EmojiGrid value={emoji} onChange={setEmoji} />
        <MoodSlider value={scale} onChange={setScale} />
        <div>
          <label className="block text-sm text-gray-600 mb-1">Add a custom trigger (optional)</label>
          <input
            value={customTrigger}
            onChange={(e) => setCustomTrigger(e.target.value)}
            placeholder="e.g., Skipped breakfast, Late meds"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="w-full rounded-md bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Log mood'}
        </button>
        {tip && <TipCard tip={tip} />}
      </div>
    </div>
  );
};
