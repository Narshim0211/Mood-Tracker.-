import React from 'react';

export interface MoodSliderProps {
  value: number;
  onChange: (v: number) => void;
}

export const MoodSlider: React.FC<MoodSliderProps> = ({ value, onChange }) => {
  return (
    <div className="w-full">
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-600"
      />
      <div className="text-sm text-gray-600 mt-1">Intensity: {value}/10</div>
    </div>
  );
};
