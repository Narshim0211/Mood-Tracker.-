import { useState } from 'react';
import { EmojiGrid } from '../components/EmojiGrid';
import { MoodSlider } from '../components/MoodSlider';
import { TipCard } from '../components/TipCard';
import { logMood } from '../services/api';

const USER_ID = 'demo-user';

export default function MoodLog() {
  const [emoji, setEmoji] = useState<string>('😌');
  const [scale, setScale] = useState<number>(5);
  const [customTrigger, setCustomTrigger] = useState<string>('');
  const [tip, setTip] = useState<string>('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setTip('');
    try {
      const res = await logMood({
        userId: USER_ID,
        emoji,
        scale,
        customTriggers: customTrigger ? [customTrigger] : [],
      });
      setTip(res.tip);
      setCustomTrigger('');
    } catch (err) {
      console.error(err);
      setTip('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">How are you feeling?</h1>
      <EmojiGrid value={emoji} onChange={setEmoji} />
      <div className="mt-6">
        <label className="text-sm text-zinc-500">Intensity</label>
        <MoodSlider value={scale} onChange={setScale} />
      </div>

      <div className="mt-4">
        <input
          className="w-full px-3 py-2 rounded-md border bg-white/80 dark:bg-zinc-900 border-zinc-300"
          placeholder="Optional: Add a personal trigger"
          value={customTrigger}
          onChange={(e) => setCustomTrigger(e.target.value)}
        />
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={handleSubmit}
        className="mt-4 inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-4 py-2 disabled:opacity-60"
      >
        {loading ? 'Logging...' : 'Log Mood'}
      </button>

      <TipCard tip={tip} />
    </div>
  );
}
