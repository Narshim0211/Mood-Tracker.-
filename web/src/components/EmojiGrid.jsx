import React from 'react'

const EMOJIS = [
  { label: 'Grumpy', symbol: '😠' },
  { label: 'Angry', symbol: '😤' },
  { label: 'Chill', symbol: '😌' },
  { label: 'Happy', symbol: '😊' },
  { label: 'Neutral', symbol: '😐' },
  { label: 'Sad', symbol: '😞' },
]

export default function EmojiGrid({ value, onChange }) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {EMOJIS.map((e) => (
        <button
          key={e.symbol}
          type="button"
          className={`card text-2xl ${value === e.symbol ? 'ring-2 ring-indigo-500' : ''}`}
          onClick={() => onChange?.(e.symbol)}
          aria-label={e.label}
        >
          <span>{e.symbol}</span>
        </button>
      ))}
    </div>
  )
}
