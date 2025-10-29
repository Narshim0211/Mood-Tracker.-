const { AITriggerService } = require('../src/services/aiTriggerService');
const { addMoodLog } = require('../src/data/store');

describe('AITriggerService (mock)', () => {
  test('returns triggers and confidence', async () => {
    const userId = 'test-user';
    addMoodLog(userId, { date: new Date().toISOString(), emoji: '😤', scale: 3, triggers: [], tip: '' });
    const svc = new AITriggerService();
    const result = await svc.detectTriggers({ userId });
    expect(Array.isArray(result.triggers)).toBe(true);
    expect(result.confidence).toBeGreaterThan(0);
  });
});
