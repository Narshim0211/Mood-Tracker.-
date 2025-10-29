import { Slider } from './ui/Slider';

export function MoodSlider({ value, onChange }) {
  return <Slider value={value} onChange={onChange} min={1} max={10} step={1} />;
}
