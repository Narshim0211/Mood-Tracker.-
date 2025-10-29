import React, { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import GraphView from '../ui/GraphView.jsx';
import { useUserStore } from '../store/userStore.js';

export default function Dashboard() {
  const userId = useUserStore((s) => s.userId);
  const [daily, setDaily] = useState([]);
  const [streak, setStreak] = useState(0);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await api.getInsights({ userId, range: 'weekly' });
      setDaily(data.averages.daily);
      setStreak(data.streak);
      setInsights(data.insights);
    };
    if (userId) load();
  }, [userId]);

  return (
    <div className="grid gap-4">
      <div className="card p-4">
        <h2 className="font-medium mb-2">Average mood (weekly)</h2>
        <GraphView data={daily} />
      </div>
      <div className="card p-4">
        <div className="text-sm text-slate-500">Streak</div>
        <div className="text-lg font-semibold">{streak} days calm – keep it up!</div>
      </div>
      {insights.length > 0 && (
        <div className="card p-4">
          <div className="text-sm text-slate-500 mb-2">Insights</div>
          <ul className="list-disc list-inside">
            {insights.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
