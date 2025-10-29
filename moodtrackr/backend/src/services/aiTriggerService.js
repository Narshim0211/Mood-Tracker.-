// AI Trigger Service - swappable provider wrapper
// For MVP, we use a heuristic/mock provider that does not require API keys

function simpleHeuristicProvider({ recentLogs = [], currentLog }) {
  const triggers = new Set();
  if (currentLog) {
    if (currentLog.scale >= 7 && ['😠', '😤'].includes(currentLog.emoji)) {
      triggers.add('High stress');
      triggers.add('Possible lack of sleep');
    }
    if (currentLog.scale <= 3 && ['😊', '😌'].includes(currentLog.emoji)) {
      triggers.add('Good rest');
      triggers.add('Positive social interaction');
    }
  }

  // Look for patterns in recent week
  const lateNights = recentLogs.filter((l) => l.triggers?.includes('Late night')).length;
  if (lateNights >= 2) triggers.add('Late night routine');

  // Limit to top 3
  return Array.from(triggers).slice(0, 3);
}

async function predictTriggers({ recentLogs = [], currentLog = null }) {
  const provider = process.env.AI_PROVIDER || 'mock';
  switch (provider) {
    case 'mock':
    default:
      return simpleHeuristicProvider({ recentLogs, currentLog });
  }
}

module.exports = { predictTriggers };
