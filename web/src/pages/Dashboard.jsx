import React, { useEffect, useState } from 'react'
import GraphView from '../components/GraphView'
import { getInsights } from '../api/client'
import { useAppStore } from '../store/useAppStore'

export default function Dashboard() {
  const { userId } = useAppStore()
  const [range, setRange] = useState('weekly')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    getInsights({ userId, range })
      .then((res) => {
        if (!active) return
        setData(res)
      })
      .catch((e) => alert(e.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [userId, range])

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600">Average mood</div>
          <div className="text-2xl font-semibold">{data?.average ?? '—'}</div>
        </div>
        <div className="flex gap-2">
          <button className={`btn ${range==='weekly' ? '' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setRange('weekly')}>Weekly</button>
          <button className={`btn ${range==='monthly' ? '' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setRange('monthly')}>Monthly</button>
        </div>
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <GraphView data={data?.series || []} />
      )}

      <div className="card">
        <div className="text-sm text-gray-600 mb-1">Streak</div>
        <div className="font-medium">{data?.streakDays || 0} days calm – keep it up!</div>
      </div>

      {data?.notes?.length ? (
        <div className="card">
          <div className="text-sm text-gray-600 mb-2">Insights</div>
          <ul className="list-disc list-inside space-y-1">
            {data.notes.map((n, i) => (
              <li key={i} className="text-sm">{n}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
