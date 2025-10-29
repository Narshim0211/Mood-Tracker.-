import { useCallback, useMemo } from 'react';

export function Slider({ value, min = 1, max = 10, step = 1, onChange }) {
  const percent = useMemo(() => ((value - min) / (max - min)) * 100, [value, min, max]);
  const handleChange = useCallback((e) => onChange?.(Number(e.target.value)), [onChange]);
  return (
    <div className="w-full">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full appearance-none rounded-lg bg-neutral-200 accent-neutral-900 dark:bg-neutral-800 dark:accent-neutral-200"
      />
      <div className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-300">Intensity: {value}</div>
      <div className="mt-1 h-1 rounded bg-neutral-200 dark:bg-neutral-800">
        <div className="h-1 rounded bg-neutral-900 dark:bg-neutral-100" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
