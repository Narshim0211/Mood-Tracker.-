import { useMemo } from 'react';
import { cn } from '../lib/cn';

const DEFAULT_EMOJIS = [
  { label: 'Grumpy', emoji: '😠' },
  { label: 'Angry', emoji: '😤' },
  { label: 'Chill', emoji: '😌' },
  { label: 'Happy', emoji: '😊' },
  { label: 'Neutral', emoji: '😐' },
  { label: 'Tired', emoji: '🥱' },
];

export function EmojiGrid({ value, onChange, options = DEFAULT_EMOJIS }) {
  const items = useMemo(() => options, [options]);
  return (
    <div className="grid grid-cols-6 gap-3">
      {items.map((item) => {
        const selected = item.emoji === value;
        return (
          <button
            key={item.emoji}
            type="button"
            onClick={() => onChange?.(item.emoji)}
            className={cn(
              'flex flex-col items-center rounded-lg border p-2 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900',
              selected ? 'border-neutral-900 dark:border-neutral-200' : 'border-neutral-200 dark:border-neutral-800'
            )}
            aria-pressed={selected}
          >
            <span className="text-3xl" aria-hidden>
              {item.emoji}
            </span>
            <span className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
