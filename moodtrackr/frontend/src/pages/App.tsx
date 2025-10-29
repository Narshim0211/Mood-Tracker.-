import React, { useMemo, useState } from 'react';
import { useMoodStore } from '../store/moodStore';
import { EmojiGrid } from '../components/EmojiGrid';
import { MoodSlider } from '../components/MoodSlider';
import { TipCard } from '../components/TipCard';
import { NotificationToggle } from '../components/NotificationToggle';

const EMOJIS = ['😠','😤','😌','😊','😐','😞','😃','😭'];

export default function App() {
  const [emoji, setEmoji] = useState<string>('😊');
  const [scale, setScale] = useState<number>(5);
  const [submitting, setSubmitting] = useState(false);
  const { lastTip, submitMood } = useMoodStore();

  const disabled = useMemo(() => submitting, [submitting]);

  async function onSubmit() {
    try {
      setSubmitting(true);
      await submitMood({ emoji, scale });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">How are you feeling?</h2>
        <EmojiGrid emojis={EMOJIS} value={emoji} onChange={setEmoji} />
        <div className="mt-4">
          <MoodSlider value={scale} onChange={setScale} />
        </div>
        <button onClick={onSubmit} disabled={disabled}
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60">
          {submitting ? 'Logging...' : 'Log mood'}
        </button>
      </div>

      <NotificationToggle />

      {lastTip && (
        <TipCard tip={lastTip} />
      )}
    </div>
  );
}
