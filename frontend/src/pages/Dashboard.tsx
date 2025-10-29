import { useEffect, useState } from 'react';
import { GraphView } from '../components/GraphView';
import { getInsights } from '../services/api';

const USER_ID = 'demo-user';

export default function Dashboard() {
  const [series, setSeries] = useState<{ day: string; avg: number }[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [insight, setInsight] = useState<string>('');
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  useEffect(() => {
    (async () => {
      try {
        const res = await getInsights(USER_ID, period);
        setSeries(res.series);
        setStreak(res.streak);
        setInsight(res.insightText);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [period]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Insights</h1>
        <select
          className="px-2 py-1 rounded-md border bg-white/80 dark:bg-zinc-900 border-zinc-300"
          value={period}
          onChange={(e) => setPeriod(e.target.value as 'week' | 'month')}
        >
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
        </select>
      </div>

      <div className="rounded-lg border p-4 bg-white/70 dark:bg-zinc-900">
        <GraphView data={series} />
      </div>

      <div className="mt-4 p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <p className="text-sm">Streak: {streak} calm day(s)</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">{insight}</p>
      </div>
    </div>
  );
}
