const request = require('supertest');
const app = require('../src/app');

describe('POST /api/mood', () => {
  it('logs mood and returns triggers and tip', async () => {
    const res = await request(app)
      .post('/api/mood')
      .send({ userId: 'u1', emoji: '😌', scale: 6 });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.triggers).toBeDefined();
    expect(typeof res.body.tip).toBe('string');
  });
});
