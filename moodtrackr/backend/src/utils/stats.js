function averageMoodScale(logs) {
  if (!logs || logs.length === 0) return NaN;
  const sum = logs.reduce((acc, l) => acc + (l.scale || 0), 0);
  return sum / logs.length;
}

function countTriggerMentions(logs) {
  const map = {};
  for (const l of logs || []) {
    for (const t of l.triggers || []) {
      map[t] = (map[t] || 0) + 1;
    }
  }
  return map;
}

function streakDays(logs) {
  // Count consecutive days with at least one log, starting from today backwards
  const byDay = new Set((logs || []).map(l => new Date(l.date).toDateString()));
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (byDay.has(d.toDateString())) streak += 1; else break;
  }
  return streak;
}

module.exports = { averageMoodScale, countTriggerMentions, streakDays };
