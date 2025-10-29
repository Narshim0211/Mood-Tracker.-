const request = require('supertest');
const app = require('../src/app');

describe('API basic flow', () => {
  it('health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('creates a mood log and returns suggestion', async () => {
    const res = await request(app)
      .post('/api/mood')
      .send({ emoji: '😌', scale: 6 });
    expect(res.status).toBe(200);
    expect(res.body.mood_log).toBeDefined();
    expect(res.body.tip).toBeDefined();
  });

  it('returns insights summary', async () => {
    await request(app).post('/api/mood').send({ emoji: '😊', scale: 7 });
    const res = await request(app).get('/api/insights/summary?range=week');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('series');
  });
});
