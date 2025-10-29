const { z } = require('zod');

const MoodLogSchema = z.object({
  date: z.coerce.date(),
  emoji: z.string(),
  scale: z.number().min(1).max(10),
  triggers: z.array(z.string()).optional().default([]),
});

function hoursBetween(a, b) {
  return Math.abs((a.getTime() - b.getTime()) / 36e5);
}

function detectHeuristicTriggers(recentLogs, currentLog) {
  const triggers = new Set();
  const scores = recentLogs.map((l) => l.scale);
  const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;

  if (avg !== null && currentLog.scale - avg >= 2) {
    triggers.add('Acute stress spike');
  }

  const hour = new Date(currentLog.date).getHours();
  if (hour <= 6 && currentLog.scale <= 4) {
    triggers.add('Lack of sleep');
  }

  if (/😠|😤/.test(currentLog.emoji) && currentLog.scale >= 6) {
    triggers.add('Interpersonal conflict');
  }

  // Look for long gaps without logs -> routine disruption
  if (recentLogs.length >= 2) {
    const sorted = [...recentLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
    for (let i = 1; i < sorted.length; i += 1) {
      if (hoursBetween(new Date(sorted[i - 1].date), new Date(sorted[i].date)) > 30) {
        triggers.add('Routine disruption');
        break;
      }
    }
  }

  return Array.from(triggers);
}

async function predictTriggers({ recentLogs, currentLog, customTriggers = [] }) {
  const parsedRecent = recentLogs.map((l) => MoodLogSchema.parse(l));
  const parsedCurrent = MoodLogSchema.parse(currentLog);

  const heuristic = detectHeuristicTriggers(parsedRecent, parsedCurrent);
  const triggers = Array.from(new Set([...(customTriggers || []), ...heuristic]));

  return { triggers };
}

module.exports = {
  predictTriggers,
};
