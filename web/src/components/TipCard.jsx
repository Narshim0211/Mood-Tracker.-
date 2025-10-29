import React from 'react'

export default function TipCard({ tip }) {
  if (!tip) return null
  return (
    <div className="card border-l-4 border-indigo-500 animate-[fadeIn_0.3s_ease]">
      <div className="text-sm text-gray-500 mb-1">Suggestion</div>
      <div className="font-medium">{tip}</div>
    </div>
  )
}
