export type MoodLogInput = {
  userId: string;
  emoji: string;
  scale: number;
  date?: string;
  customTriggers?: string[];
};

export type MoodLogResponse = {
  ok: boolean;
  log: { date: string; emoji: string; scale: number; triggers: string[]; tip: string };
  triggers: string[];
  tip: string;
};

export type InsightsResponse = {
  ok: boolean;
  series: { day: string; avg: number }[];
  streak: number;
  insightText: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export async function logMood(input: MoodLogInput): Promise<MoodLogResponse> {
  const res = await fetch(`${API_BASE}/api/mood`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Failed to log mood: ${res.status}`);
  return res.json();
}

export async function getInsights(userId: string, period: 'week' | 'month' = 'week'): Promise<InsightsResponse> {
  const url = new URL(`${API_BASE}/api/insights`);
  url.searchParams.set('userId', userId);
  url.searchParams.set('period', period);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch insights: ${res.status}`);
  return res.json();
}
