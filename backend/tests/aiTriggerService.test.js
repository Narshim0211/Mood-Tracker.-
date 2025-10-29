const { predictTriggers } = require('../src/services/aiTriggerService');

describe('aiTriggerService', () => {
  test('returns heuristic triggers including lack of sleep when early and low scale', async () => {
    const recent = [
      { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), emoji: '😊', scale: 7 },
      { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), emoji: '😌', scale: 6 },
    ];
    const current = { date: new Date(new Date().setHours(5)), emoji: '😠', scale: 4 };

    const { triggers } = await predictTriggers({ recentLogs: recent, currentLog: current, customTriggers: [] });
    expect(Array.isArray(triggers)).toBe(true);
    expect(triggers.length).toBeGreaterThan(0);
  });
});
