import React, { useMemo } from 'react';
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

export default function GraphView({ data }) {
  const chartData = useMemo(() => ({
    labels: data.map((d) => d.date.slice(5)),
    datasets: [
      {
        label: 'Avg Mood',
        data: data.map((d) => d.avg),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        tension: 0.25,
      },
    ],
  }), [data]);

  const options = useMemo(() => ({
    responsive: true,
    scales: {
      y: { min: 0, max: 10, ticks: { stepSize: 1 } },
    },
    plugins: { legend: { display: false } },
  }), []);

  return <Line data={chartData} options={options} />;
}
