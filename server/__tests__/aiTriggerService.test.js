const { detectTriggersFromLogs } = require('../src/services/aiTriggerService');

describe('aiTriggerService (mock)', () => {
  test('returns array of strings', async () => {
    delete process.env.OPENAI_API_KEY; // force mock provider
    const logs = [
      { date: new Date(), emoji: '😠', scale: 3 },
      { date: new Date(), emoji: '😌', scale: 6 },
    ];
    const triggers = await detectTriggersFromLogs(logs);
    expect(Array.isArray(triggers)).toBe(true);
    expect(triggers.every((t) => typeof t === 'string')).toBe(true);
  });
});
