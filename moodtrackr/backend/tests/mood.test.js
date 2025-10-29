const request = require('supertest');
const app = require('../src/index.js');

describe('Mood routes', () => {
  const userId = 'test-user-1';

  it('logs mood and returns triggers + tip', async () => {
    const res = await request(app)
      .post('/api/mood')
      .send({ userId, emoji: '😤', scale: 8, customTrigger: 'Skipped breakfast' })
      .expect(200);

    expect(res.body).toHaveProperty('log');
    expect(Array.isArray(res.body.triggers)).toBe(true);
    expect(typeof res.body.tip).toBe('string');
    expect(res.body.log.scale).toBe(8);
  });

  it('returns insights summary', async () => {
    const res = await request(app)
      .get('/api/insights/summary')
      .query({ userId, range: 'weekly' })
      .expect(200);

    expect(Array.isArray(res.body.series)).toBe(true);
    expect(typeof res.body.streak).toBe('number');
    expect(typeof res.body.insight).toBe('string');
  });
});
