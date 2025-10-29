import React from 'react';

const EMOJIS = [
  { symbol: '😠', label: 'Grumpy' },
  { symbol: '😤', label: 'Angry' },
  { symbol: '😌', label: 'Chill' },
  { symbol: '😊', label: 'Happy' },
  { symbol: '😐', label: 'Neutral' },
  { symbol: '😢', label: 'Sad' },
];

export interface EmojiGridProps {
  value: string;
  onChange: (emoji: string) => void;
}

export const EmojiGrid: React.FC<EmojiGridProps> = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-6 gap-2">
      {EMOJIS.map((e) => (
        <button
          key={e.symbol}
          type="button"
          onClick={() => onChange(e.symbol)}
          className={`p-3 rounded-md border transition hover:scale-105 ${
            value === e.symbol ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200'
          }`}
          aria-label={e.label}
        >
          <span className="text-2xl" role="img" aria-label={e.label}>
            {e.symbol}
          </span>
        </button>
      ))}
    </div>
  );
};
