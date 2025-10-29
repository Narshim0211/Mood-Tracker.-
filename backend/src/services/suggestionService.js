// Suggestion service: combines predefined tips with AI context

const PRESET_TIPS = [
  'Take 3 deep breaths',
  'Splash cool water on your face',
  'Stand up and stretch for 1 minute',
  'Take a 5-minute walk',
  'Write down one thing stressing you and one next step',
];

function pickSuggestion({ recentLogs }) {
  // If user improved after walking previously, bias towards walk
  const lastTwo = recentLogs.slice(-2);
  if (
    lastTwo.length === 2 &&
    lastTwo[0]?.tip?.toLowerCase().includes('walk') &&
    lastTwo[1].scale > lastTwo[0].scale
  ) {
    return 'You felt better after a walk — try a 5-minute walk again.';
  }

  const random = PRESET_TIPS[Math.floor(Math.random() * PRESET_TIPS.length)];
  return random;
}

module.exports = { pickSuggestion };
