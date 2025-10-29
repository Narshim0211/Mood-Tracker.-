import React from 'react';

export function EmojiGrid({ emojis, value, onChange }: { emojis: string[]; value: string; onChange: (v: string)=>void; }) {
  return (
    <div className="grid grid-cols-8 gap-2">
      {emojis.map((e) => (
        <button
          type="button"
          key={e}
          onClick={() => onChange(e)}
          className={`text-2xl p-2 rounded border ${value === e ? 'border-blue-600 bg-blue-50' : 'border-transparent hover:bg-gray-50'}`}
        >
          {e}
        </button>
      ))}
    </div>
  );
}
