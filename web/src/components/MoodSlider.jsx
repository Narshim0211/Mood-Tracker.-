import React from 'react'
import * as Slider from '@radix-ui/react-slider'

export default function MoodSlider({ value, onChange }) {
  const val = Array.isArray(value) ? value : [value]
  return (
    <div className="py-4">
      <div className="text-sm text-gray-600 mb-2">Intensity: {val[0]}</div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={val}
        min={1}
        max={10}
        step={1}
        onValueChange={(v) => onChange?.(v[0])}
      >
        <Slider.Track className="bg-gray-200 relative grow rounded-full h-1">
          <Slider.Range className="absolute bg-indigo-500 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb className="block size-4 bg-white shadow rounded-full border border-gray-300" aria-label="Intensity" />
      </Slider.Root>
    </div>
  )
}
