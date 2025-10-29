import { useEffect, useState } from 'react';
import { GraphView } from '../components/GraphView';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { api } from '../lib/api';
import { useApp } from '../context/AppContext';

export default function Dashboard() {
  const { userId } = useApp();
  const [period, setPeriod] = useState('weekly');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .insights(userId, period)
      .then((res) => mounted && setData(res))
      .catch((e) => {
        console.error(e);
        if (mounted) setData(null);
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [userId, period]);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Insights</h1>
        <div className="flex gap-2">
          <button
            className={`rounded-md px-3 py-1 text-sm ${period === 'weekly' ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900' : 'border border-neutral-300 dark:border-neutral-700'}`}
            onClick={() => setPeriod('weekly')}
          >
            Weekly
          </button>
          <button
            className={`rounded-md px-3 py-1 text-sm ${period === 'monthly' ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900' : 'border border-neutral-300 dark:border-neutral-700'}`}
            onClick={() => setPeriod('monthly')}
          >
            Monthly
          </button>
        </div>
      </header>

      {loading ? (
        <p className="text-sm text-neutral-600 dark:text-neutral-300">Loading...</p>
      ) : data ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Average mood over time</CardTitle>
            </CardHeader>
            <CardContent>
              <GraphView series={data.series} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold">{data.average}</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-300">Average mood</div>
                <div className="text-3xl font-bold">{data.streak}</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-300">Day streak ≥ 6</div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Insight</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{data.insightText}</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <p className="text-sm text-neutral-600 dark:text-neutral-300">No data yet. Log your mood to see insights.</p>
      )}
    </div>
  );
}
