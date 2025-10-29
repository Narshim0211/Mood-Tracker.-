import React from 'react';

export function TipCard({ tip }: { tip: string }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 animate-[fadeIn_0.3s_ease-out]">
      <div className="text-sm text-gray-500 mb-1">Suggestion</div>
      <div className="text-base">{tip}</div>
    </div>
  );
}
