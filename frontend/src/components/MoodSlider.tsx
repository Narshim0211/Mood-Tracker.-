import * as Slider from '@radix-ui/react-slider';

export function MoodSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="w-full py-4">
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={[value]}
        min={1}
        max={10}
        step={1}
        onValueChange={(vals) => onChange(vals[0])}
        aria-label="Mood intensity"
      >
        <Slider.Track className="bg-zinc-300 dark:bg-zinc-700 relative rounded-full h-2 w-full">
          <Slider.Range className="absolute bg-blue-600 h-full rounded-full" />
        </Slider.Track>
        <Slider.Thumb className="block w-5 h-5 bg-white dark:bg-zinc-200 border border-zinc-400 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </Slider.Root>
      <div className="flex justify-between text-xs text-zinc-500 mt-1">
        <span>1</span>
        <span>10</span>
      </div>
    </div>
  );
}
