import { useState } from 'react';
import { EmojiGrid } from '../components/EmojiGrid';
import { MoodSlider } from '../components/MoodSlider';
import { Button } from '../components/ui/Button';
import { TipCard } from '../components/TipCard';
import { api } from '../lib/api';
import { useApp } from '../context/AppContext';

export default function MoodLog() {
  const { userId } = useApp();
  const [emoji, setEmoji] = useState('😊');
  const [scale, setScale] = useState(7);
  const [custom, setCustom] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setResult(null);
    try {
      const payload = { userId, emoji, scale, triggers: custom ? [custom] : [] };
      const res = await api.logMood(payload);
      setResult(res.data);
    } catch (e) {
      console.error(e);
      alert('Failed to log mood.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">How are you feeling?</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">Quick check-in. It takes 10 seconds.</p>
      </header>

      <section className="space-y-4">
        <EmojiGrid value={emoji} onChange={setEmoji} />
        <MoodSlider value={scale} onChange={setScale} />

        <div className="flex items-center gap-2">
          <input
            className="flex-1 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:focus:ring-neutral-200"
            placeholder="Add a personal trigger (optional)"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
          />
          <Button onClick={submit} disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</Button>
        </div>
      </section>

      {result && (
        <section className="space-y-3">
          <div>
            <h2 className="font-semibold">Likely triggers</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {result.triggers.map((t) => (
                <span key={t} className="rounded-full border border-neutral-300 px-3 py-1 text-xs dark:border-neutral-700">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <TipCard tip={result.tip} />
        </section>
      )}
    </div>
  );
}
