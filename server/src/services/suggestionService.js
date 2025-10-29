const BASE_SUGGESTIONS = [
  'Take 3 deep breaths (4-4-6)',
  'Drink a glass of water',
  'Short walk (5 minutes)',
  'Quick stretch (neck/shoulders)',
  'Journal 2 lines about your feeling',
  'Splash water on your face',
  'Play a favorite song',
];

function chooseSuggestion({ logs = [], triggers = [] } = {}) {
  const recent = logs.slice(-10);
  // If user previously improved after a walk, bias towards that
  const hadWalkTip = recent.some((l) => /walk/i.test(l.tip || ''));
  if (hadWalkTip) return 'You felt better after a walk — try that again.';

  if (triggers.some((t) => /sleep/i.test(t))) {
    return 'Low energy detected — try a short stretch and water.';
  }
  if (triggers.some((t) => /conflict|frustration/i.test(t))) {
    return 'Reset with 3 deep breaths and a brief walk.';
  }

  return BASE_SUGGESTIONS[Math.floor(Math.random() * BASE_SUGGESTIONS.length)];
}

module.exports = { chooseSuggestion };
