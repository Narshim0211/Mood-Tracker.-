export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

export const api = {
  logMood: (payload) => request('/mood', { method: 'POST', body: JSON.stringify(payload) }),
  predictTriggers: (payload) => request('/triggers/predict', { method: 'POST', body: JSON.stringify(payload) }),
  insights: (userId, period = 'weekly') => request(`/insights/summary?userId=${encodeURIComponent(userId)}&period=${period}`),
};
