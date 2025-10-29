import React from 'react';
import clsx from 'clsx';

const EMOJIS = ['😠', '😤', '😌', '😊', '😢', '😐', '😁', '🤯'];

export default function EmojiGrid({ value, onChange }) {
  return (
    <div className="grid grid-cols-8 gap-2">
      {EMOJIS.map((e) => (
        <button
          key={e}
          className={clsx(
            'text-2xl p-2 rounded-md border hover:bg-slate-50',
            value === e ? 'border-brand-600 ring-2 ring-brand-200' : 'border-slate-200'
          )}
          onClick={() => onChange(e)}
        >
          <span role="img" aria-label="emoji">{e}</span>
        </button>
      ))}
    </div>
  );
}
