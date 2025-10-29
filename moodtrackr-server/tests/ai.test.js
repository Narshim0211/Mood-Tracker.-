const { predictTriggers, selectTip } = require('../src/services/aiTriggerService');

describe('AI Trigger Service (heuristics)', () => {
  it('predicts triggers based on emoji and scale', async () => {
    const triggers = await predictTriggers({
      userId: 'u',
      recentLogs: [{ emoji: '😊', scale: 8, date: new Date() }],
      current: { emoji: '😤', scale: 3, date: new Date() },
    });
    expect(Array.isArray(triggers)).toBe(true);
    expect(triggers.length).toBeGreaterThan(0);
  });

  it('selects a tip string', () => {
    const tip = selectTip({
      recentLogs: [{ emoji: '😊', scale: 8, date: new Date() }],
      current: { emoji: '😤', scale: 3, date: new Date() },
      triggers: ['Lack of sleep'],
    });
    expect(typeof tip).toBe('string');
  });
});
