import React, { useMemo, useState } from 'react';
import EmojiGrid from '../ui/EmojiGrid.jsx';
import MoodSlider from '../ui/MoodSlider.jsx';
import TipCard from '../ui/TipCard.jsx';
import { api } from '../services/api.js';
import { useUserStore } from '../store/userStore.js';

export default function MoodLog() {
  const userId = useUserStore((s) => s.userId);
  const [emoji, setEmoji] = useState('😊');
  const [scale, setScale] = useState(6);
  const [triggers, setTriggers] = useState([]);
  const [customTrigger, setCustomTrigger] = useState('');
  const [tip, setTip] = useState('');
  const [triggersDetected, setTriggersDetected] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => userId && emoji && scale, [userId, emoji, scale]);

  const onSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const res = await api.logMood({ userId, emoji, scale, triggers });
      setTip(res.tip);
      const det = await api.detectTriggers({ userId });
      setTriggersDetected(det.triggers);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="card p-4">
        <h2 className="font-medium mb-2">How are you feeling?</h2>
        <EmojiGrid value={emoji} onChange={setEmoji} />
        <div className="mt-4">
          <MoodSlider value={scale} onChange={setScale} />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium">Triggers</label>
          <div className="flex gap-2 mt-2">
            <input
              className="flex-1 border rounded-md px-3 py-2"
              placeholder="Add custom trigger"
              value={customTrigger}
              onChange={(e) => setCustomTrigger(e.target.value)}
            />
            <button
              className="btn btn-ghost"
              onClick={() => {
                if (!customTrigger.trim()) return;
                setTriggers((t) => Array.from(new Set([...t, customTrigger.trim()])));
                setCustomTrigger('');
              }}
            >
              Add
            </button>
          </div>
          {triggers.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {triggers.map((t) => (
                <span key={t} className="px-2 py-1 text-xs bg-slate-100 rounded">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="mt-4">
          <button className="btn btn-primary" disabled={!canSubmit || submitting} onClick={onSubmit}>
            {submitting ? 'Submitting…' : 'Submit'}
          </button>
        </div>
      </div>

      {!!tip && (
        <TipCard title="Try this now" text={tip} />
      )}

      {triggersDetected.length > 0 && (
        <div className="card p-4">
          <div className="text-sm text-slate-500">Possible triggers</div>
          <div className="mt-2 flex gap-2 flex-wrap">
            {triggersDetected.map((t) => (
              <span key={t} className="px-2 py-1 text-xs bg-slate-100 rounded">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
