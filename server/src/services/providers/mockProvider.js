function detectTriggersFromLogs(logs) {
  // Very naive heuristics for MVP mock
  const triggers = new Set();
  const lowerRecent = logs.slice(-7);
  const avg =
    lowerRecent.reduce((sum, l) => sum + (l.scale || 0), 0) /
    Math.max(1, lowerRecent.length);

  if (avg <= 4) {
    triggers.add('Lack of sleep');
    triggers.add('High stress');
  }

  const emojis = lowerRecent.map((l) => l.emoji).join('');
  if (/😠|😤/.test(emojis)) {
    triggers.add('Conflict or frustration');
  }

  // Simple time-based guess
  const hours = lowerRecent.map((l) => new Date(l.date).getHours());
  if (hours.some((h) => h < 8)) {
    triggers.add('Early start');
  }

  return Array.from(triggers).slice(0, 3);
}

module.exports = { detectTriggersFromLogs };
