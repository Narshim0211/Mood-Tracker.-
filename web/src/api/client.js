const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error || 'Request failed')
  }
  return res.json()
}

export const logMood = (payload) => api('/api/mood', { method: 'POST', body: payload })
export const getInsights = (params) => {
  const q = new URLSearchParams(params)
  return api(`/api/insights?${q.toString()}`)
}
export const getTriggers = (payload) => api('/api/triggers', { method: 'POST', body: payload })
