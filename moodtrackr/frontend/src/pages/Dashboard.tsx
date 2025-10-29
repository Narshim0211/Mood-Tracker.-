import React, { useEffect, useState } from 'react';
import { getJson } from '../api/client';
import { useUserStore } from '../store/user';
import { GraphView } from '../components/GraphView';
import type { Point } from '../components/GraphView';

interface InsightsResponse {
  series: Point[];
  streak: number;
  insight: string;
}

const Dashboard: React.FC = () => {
  const userId = useUserStore((s) => s.userId);
  const [data, setData] = useState<Point[]>([]);
  const [streak, setStreak] = useState(0);
  const [insight, setInsight] = useState('');
  const [range, setRange] = useState<'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    (async () => {
      try {
        const res = await getJson<InsightsResponse>('/insights/summary', { userId, range });
        setData(res.series);
        setStreak(res.streak);
        setInsight(res.insight);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [userId, range]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Insights</h1>
        <select
          className="rounded-md border px-2 py-1"
          value={range}
          onChange={(e) => setRange(e.target.value as 'weekly' | 'monthly')}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <GraphView data={data} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm text-gray-500">Streak</div>
          <div className="text-3xl font-semibold">{streak} days calm</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm text-gray-500">Insight</div>
          <div className="text-base">{insight}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
