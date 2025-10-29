const { averageMoodScale, countTriggerMentions } = require('../utils/stats');

// Basic heuristic AI: derive likely triggers from recent logs and current context.
// Optionally, if OPENAI_API_KEY is present, this can call a real model later.
async function detectTriggers({ currentLog, recentLogs }) {
  const triggers = new Set();

  if (currentLog.scale <= 3) {
    triggers.add('High stress');
  }
  if (currentLog.scale >= 8) {
    triggers.add('Positive social interaction');
  }

  const avg = averageMoodScale(recentLogs);
  if (!Number.isNaN(avg)) {
    if (avg - currentLog.scale >= 2) {
      triggers.add('Sleep debt');
    } else if (currentLog.scale - avg >= 2) {
      triggers.add('Recovered energy');
    }
  }

  const historicalTriggers = countTriggerMentions(recentLogs);
  for (const [t, count] of Object.entries(historicalTriggers)) {
    if (count >= 2) triggers.add(t);
  }

  if (currentLog.emoji === '😠' || currentLog.emoji === '😤') {
    triggers.add('Conflict or frustration');
  }
  if (currentLog.emoji === '😌') {
    triggers.add('Calming activity');
  }

  return Array.from(triggers).slice(0, 5);
}

module.exports = { detectTriggers };
