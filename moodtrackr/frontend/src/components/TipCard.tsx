import React from 'react';

export const TipCard: React.FC<{ tip: string }> = ({ tip }) => {
  return (
    <div className="mt-4 p-4 rounded-lg border bg-white shadow-sm animate-[fadeIn_0.3s_ease]">
      <div className="text-sm text-gray-500">Suggestion</div>
      <div className="text-base font-medium">{tip}</div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};
