const SUGGESTIONS = [
  'Take 3 deep breaths and stretch your shoulders.',
  'Splash cold water on your face.',
  'Take a 5-minute walk and hydrate.',
  'Write down one worry and one positive thing.',
  'Message a friend or step away from chat for 10 minutes.',
  'Listen to a favorite song for 3 minutes.',
  'Do a quick posture reset and neck stretch.'
];

function personalizeSuggestion(triggers, recentLogs) {
  // If walking previously followed by improved mood, bias to walk
  const sorted = [...recentLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
  for (let i = 1; i < sorted.length; i += 1) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    if (curr.scale < prev.scale - 1) {
      return 'You felt better after movement before — try a short walk.';
    }
  }

  if (triggers.includes('Lack of sleep')) {
    return 'Short nap or quiet time could help. Dim screens if possible.';
  }
  if (triggers.includes('Interpersonal conflict')) {
    return 'Pause before replying. Draft and revisit in 10 minutes.';
  }

  // Fallback generic
  return SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)];
}

module.exports = {
  personalizeSuggestion,
  SUGGESTIONS,
};
