import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export function GraphView({ series }) {
  const labels = series?.map((p) => p.date) ?? [];
  const data = {
    labels,
    datasets: [
      {
        label: 'Average Mood',
        data: series?.map((p) => p.averageScale) ?? [],
        fill: false,
        borderColor: '#111827',
        backgroundColor: '#111827',
        tension: 0.25,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { min: 1, max: 10, ticks: { stepSize: 1 } },
    },
  };
  return <Line data={data} options={options} />;
}
