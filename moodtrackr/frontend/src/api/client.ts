export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export async function getJson<T>(path: string, params?: Record<string, string>): Promise<T> {
  const qs = params ? `?${new URLSearchParams(params).toString()}` : '';
  const res = await fetch(`${API_URL}${path}${qs}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}
