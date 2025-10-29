import React from 'react';

export default function TipCard({ title, text }) {
  return (
    <div className="card p-4 animate-[fadeIn_300ms_ease]">
      <div className="text-sm text-slate-500 mb-1">{title}</div>
      <div className="font-medium">{text}</div>
    </div>
  );
}
