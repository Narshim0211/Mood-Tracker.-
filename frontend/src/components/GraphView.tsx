import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, LinearScale, PointElement, CategoryScale, Tooltip, Legend);

export function GraphView({
  data,
}: {
  data: { day: string; avg: number }[];
}) {
  const chartData = {
    labels: data.map((d) => d.day.slice(5)),
    datasets: [
      {
        label: 'Avg Mood',
        data: data.map((d) => d.avg),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.15)',
        tension: 0.3,
        fill: true,
      },
    ],
  };
  const options = {
    responsive: true,
    scales: { y: { min: 1, max: 10 } },
    plugins: { legend: { display: false } },
  } as const;

  return (
    <div className="w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}
