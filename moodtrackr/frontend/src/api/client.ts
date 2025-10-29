// Prefer VITE_API_URL. Fallback to relative /api in browsers, and localhost in SSR/dev tools.
const defaultApiBase = typeof window !== 'undefined' ? '/api' : 'http://localhost:4000/api';
export const API_URL = import.meta.env.VITE_API_URL || defaultApiBase;

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
