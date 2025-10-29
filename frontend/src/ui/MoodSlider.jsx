import React from 'react';

export default function MoodSlider({ value, onChange }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Intensity</span>
        <span className="font-medium">{value}/10</span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-brand-600"
      />
      <div className="flex justify-between text-xs text-slate-500">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}
