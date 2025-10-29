const SUGGESTIONS = [
  { key: 'breath', text: 'Try 2 minutes of deep breathing.' },
  { key: 'water', text: 'Drink a glass of water.' },
  { key: 'walk', text: 'Take a 5-minute walk.' },
  { key: 'music', text: 'Listen to a calming playlist.' },
  { key: 'journal', text: 'Write down three thoughts you feel.' },
  { key: 'nap', text: 'If possible, take a 15-minute nap.' },
];

function pickSuggestion({ triggers, recentLogs }) {
  const lower = triggers.map(t => t.toLowerCase());

  if (lower.some(t => t.includes('sleep'))) return 'If tired, consider a short nap or earlier bedtime.';
  if (lower.some(t => t.includes('conflict'))) return 'Step away briefly, breathe, then message calmly when ready.';
  if (lower.some(t => t.includes('stress'))) return 'Box breathing (4-4-4-4) can lower stress quickly.';

  // If recent logs show improvement after a walk, suggest it again.
  const walkedAndImproved = recentLogs.some((l, i, arr) => {
    if (!l.tip || !l.tip.toLowerCase().includes('walk')) return false;
    const next = arr[i + 1];
    return next && next.scale > l.scale;
  });
  if (walkedAndImproved) return 'Walking helped before — try a quick walk again.';

  return SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)].text;
}

module.exports = { pickSuggestion, SUGGESTIONS };
