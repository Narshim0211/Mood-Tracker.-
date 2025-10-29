// AI Trigger Service abstraction
// This module can swap providers (OpenAI, Anthropic, Local) by changing provider implementation

const { getMoodLogs } = require('../data/store');

class BaseAIProvider {
  async inferTriggers(_context) {
    throw new Error('Not implemented');
  }
}

class MockAIProvider extends BaseAIProvider {
  // Heuristic-based mock inference using recent logs
  async inferTriggers(context) {
    const { userId } = context;
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const logs = getMoodLogs(userId, { since: lastWeek });

    const avg = logs.length
      ? logs.reduce((sum, l) => sum + (l.scale || 0), 0) / logs.length
      : 5;

    const candidates = [];

    // Heuristics based on emojis and scale trends
    const recent = logs.slice(-5);
    const recentEmojis = new Set(recent.map((l) => l.emoji));

    if (recentEmojis.has('😠') || recentEmojis.has('😤')) candidates.push('conflict');
    if (recentEmojis.has('😌')) candidates.push('rested');

    if (avg < 4) {
      candidates.push('lack_of_sleep');
      candidates.push('stress');
    } else if (avg > 7) {
      candidates.push('social_time');
    }

    // Always provide a few generic options
    const generic = ['skipped_breakfast', 'late_meds', 'over_scheduled'];

    const triggers = Array.from(new Set([...candidates, ...generic])).slice(0, 4);

    return {
      triggers,
      confidence: 0.6,
      note: 'Mock AI based on recent logs and heuristics.',
    };
  }
}

class AITriggerService {
  constructor(provider = new MockAIProvider()) {
    this.provider = provider;
  }

  async detectTriggers(context) {
    return this.provider.inferTriggers(context);
  }
}

module.exports = {
  AITriggerService,
  MockAIProvider,
};
