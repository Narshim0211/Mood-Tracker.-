import React from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

function formatDate(iso) {
  const d = new Date(iso)
  return `${d.getMonth()+1}/${d.getDate()}`
}

export default function GraphView({ data }) {
  if (!data?.length) return <div className="text-sm text-gray-500">No data yet</div>
  return (
    <div className="card">
      <div className="text-sm text-gray-600 mb-2">Average mood over time</div>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.map((d) => ({ ...d, label: formatDate(d.date) }))}>
            <XAxis dataKey="label" />
            <YAxis domain={[1, 10]} allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="avg" stroke="#6366f1" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
