import React, { Suspense, useEffect, useState } from 'react';
import { fetchInsights } from '../services/api';
const LineChart = React.lazy(() => import('react-chartjs-2').then((m) => ({ default: m.Line })));
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [range, setRange] = useState<'week'|'month'>('week');
  const [series, setSeries] = useState<{date:string, avg:number}[]>([]);
  const [avg, setAvg] = useState<number|null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    (async () => {
      const data = await fetchInsights(range);
      setSeries(data.series || []);
      setAvg(data.average);
      setStreak(data.streak || 0);
      setMessage(data.message || '');
    })();
  }, [range]);

  const chartData = {
    labels: series.map(p => p.date),
    datasets: [
      {
        label: 'Avg Mood',
        data: series.map(p => p.avg),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.3)'
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Insights</h2>
          <select value={range} onChange={e => setRange(e.target.value as any)} className="border rounded px-2 py-1">
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
          </select>
        </div>
        <div className="mt-4">
          <Suspense>
            <LineChart data={chartData} options={{ responsive: true, scales: { y: { min: 0, max: 10 }}}} />
          </Suspense>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-500">Average mood</div>
          <div className="text-2xl font-semibold">{avg?.toFixed(1) ?? '-'}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-500">Streak</div>
          <div className="text-2xl font-semibold">{streak} days</div>
          {streak >= 3 && (
            <div className="text-green-600 text-sm mt-1">🏅 {streak} days calm – keep it up!</div>
          )}
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-500">Insight</div>
          <div className="text-base">{message}</div>
        </div>
      </div>
    </div>
  );
}
