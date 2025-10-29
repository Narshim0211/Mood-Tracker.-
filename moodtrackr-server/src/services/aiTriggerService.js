// AI Trigger Service: Swappable, with offline heuristics fallback
// For real AI, set OPENAI_API_KEY and implement provider in callProvider()

const dayjs = require('dayjs');

async function callProvider(_context) {
  // Placeholder for real AI call (OpenAI/Anthropic/etc.)
  // Always return null to use heuristic fallback unless implemented
  return null;
}

function heuristicPredictTriggers({ recentLogs, current }) {
  const triggers = new Set();

  // Basic mappings based on emoji
  const emojiMap = {
    '😠': ['Conflict', 'Overstimulation'],
    '😤': ['Frustration', 'Deadline pressure'],
    '😌': ['Rested', 'Calm environment'],
    '😊': ['Positive social interaction', 'Accomplishment'],
  };

  if (emojiMap[current.emoji]) {
    emojiMap[current.emoji].forEach((t) => triggers.add(t));
  }

  // Scale intensity
  if (current.scale <= 3) {
    ['Lack of sleep', 'Stress', 'Hunger'].forEach((t) => triggers.add(t));
  } else if (current.scale >= 8) {
    ['Good sleep', 'Physical activity', 'Supportive conversation'].forEach((t) => triggers.add(t));
  }

  // Time-of-day hints
  const hour = dayjs(current.date || new Date()).hour();
  if (hour <= 10 && current.scale <= 4) triggers.add('Skipped breakfast');
  if (hour >= 22 && current.scale <= 4) triggers.add('Late night screen time');

  // Patterns from recent logs: simple slope of last 3 entries
  if (recentLogs && recentLogs.length >= 3) {
    const lastThree = recentLogs.slice(-3);
    const avg = lastThree.reduce((a, b) => a + b.scale, 0) / lastThree.length;
    if (current.scale < avg - 2) triggers.add('Acute stressor');
    if (current.scale > avg + 2) triggers.add('Positive routine change');
  }

  return Array.from(triggers).slice(0, 5);
}

function selectTip({ recentLogs, current, triggers }) {
  // Personalized heuristics
  const lastBetter = recentLogs?.findLast?.((l) => l.scale >= 7);
  if (lastBetter) {
    return 'You felt better after a walk previously — try a 10-min walk.';
  }

  // Trigger-informed tips
  if (triggers.includes('Lack of sleep')) return 'Try a 20-min power nap or early bedtime.';
  if (triggers.includes('Hunger')) return 'Have a quick snack and hydrate.';
  if (triggers.includes('Conflict')) return 'Step away and take 5 deep breaths.';

  // Default simple tip list
  const tips = [
    'Inhale for 4, hold 4, exhale 6 — repeat 5x.',
    'Get sunlight for 5 minutes if possible.',
    'Splash cool water on your face.',
    'Write one thing that went well today.',
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}

async function predictTriggers({ userId, recentLogs, current }) {
  const ai = await callProvider({ userId, recentLogs, current });
  if (ai?.triggers?.length) return ai.triggers;
  return heuristicPredictTriggers({ recentLogs, current });
}

module.exports = { predictTriggers, selectTip };
