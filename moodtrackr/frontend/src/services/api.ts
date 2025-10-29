export type MoodLogInput = { emoji: string; scale: number; triggers?: string[] };

export async function submitMood(input: MoodLogInput) {
  const res = await fetch('/api/mood', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to submit mood');
  return res.json();
}

export async function fetchInsights(range: 'week'|'month') {
  const res = await fetch(`/api/insights/summary?range=${range}`);
  if (!res.ok) throw new Error('Failed to fetch insights');
  return res.json();
}
