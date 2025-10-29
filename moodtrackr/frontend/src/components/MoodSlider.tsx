import React from 'react';

export function MoodSlider({ value, onChange }: { value: number; onChange: (n: number)=>void; }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-sm mb-1">
        <span>Intensity</span>
        <span className="font-mono">{value}/10</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={e => onChange(parseInt(e.target.value, 10))}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>1</span>
        <span>10</span>
      </div>
    </div>
  );
}
