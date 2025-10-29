const BASE_SUGGESTIONS = [
  'Take 5 deep breaths',
  'Drink a glass of water',
  'Go for a 5-minute walk',
  'Do a quick stretch',
  'Splash water on your face',
  'Write one thing you are grateful for',
];

function getSuggestion({ recentLogs = [], currentLog }) {
  const improvedAfterWalk = recentLogs.some(
    (l, idx, arr) => l.tip?.toLowerCase().includes('walk') && idx < arr.length - 1 && arr[idx + 1].scale < l.scale
  );

  if (improvedAfterWalk) {
    return 'You felt better faster after a walk — try that again.';
  }

  if (currentLog?.scale >= 7 && ['😠', '😤'].includes(currentLog.emoji)) {
    return 'Take 5 deep breaths and step away for a minute.';
  }

  const index = Math.floor(Math.random() * BASE_SUGGESTIONS.length);
  return BASE_SUGGESTIONS[index];
}

module.exports = { getSuggestion };
