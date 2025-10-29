const { predictTriggers } = require('../src/services/aiTriggerService.js');

describe('AI Trigger Service (mock)', () => {
  it('returns triggers for high-intensity negative mood', async () => {
    const recentLogs = [];
    const currentLog = { emoji: '😠', scale: 9 };
    const triggers = await predictTriggers({ recentLogs, currentLog });
    expect(Array.isArray(triggers)).toBe(true);
    expect(triggers.length).toBeGreaterThan(0);
  });
});
