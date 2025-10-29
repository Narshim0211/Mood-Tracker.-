const BASE = '/api';

async function req(path, options) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

export const api = {
  logMood: ({ userId, emoji, scale, triggers }) =>
    req('/mood', { method: 'POST', body: JSON.stringify({ userId, emoji, scale, triggers }) }),
  listMoods: ({ userId }) => req(`/mood?userId=${encodeURIComponent(userId)}`),
  detectTriggers: ({ userId }) => req('/triggers', { method: 'POST', body: JSON.stringify({ userId }) }),
  getInsights: ({ userId, range }) => req('/insights', { method: 'POST', body: JSON.stringify({ userId, range }) }),
};
