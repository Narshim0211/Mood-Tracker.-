const request = require('supertest');
const app = require('../src/index');

describe('MoodTrackr routes', () => {
  const userId = 'routes-user';

  test('health check', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('create mood log and get tip', async () => {
    const res = await request(app)
      .post('/api/mood')
      .send({ userId, emoji: '😊', scale: 7, triggers: ['hug'] });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.log.emoji).toBe('😊');
    expect(typeof res.body.tip).toBe('string');
  });

  test('list mood logs', async () => {
    const res = await request(app).get('/api/mood').query({ userId });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.logs)).toBe(true);
    expect(res.body.logs.length).toBeGreaterThan(0);
  });

  test('trigger detection', async () => {
    const res = await request(app).post('/api/triggers').send({ userId });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.triggers)).toBe(true);
  });

  test('insights weekly', async () => {
    const res = await request(app).post('/api/insights').send({ userId, range: 'weekly' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('averages');
  });
});
