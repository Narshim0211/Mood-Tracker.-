const request = require('supertest');
const { app } = require('../src/app');
const { connectToDatabase, disconnectFromDatabase } = require('../src/db');

const TEST_USER = 'test-user-2';

beforeAll(async () => {
  process.env.USE_MEMORY_MONGO = 'true';
  await connectToDatabase();
});

afterAll(async () => {
  await disconnectFromDatabase();
});

describe('GET /insights/summary', () => {
  it('returns summary with series and streak', async () => {
    // Seed a few logs
    await request(app).post('/mood').send({ userId: TEST_USER, emoji: '😊', scale: 8 });
    await request(app).post('/mood').send({ userId: TEST_USER, emoji: '😌', scale: 7 });
    await request(app).post('/mood').send({ userId: TEST_USER, emoji: '😠', scale: 3 });

    const res = await request(app).get(`/insights/summary`).query({ userId: TEST_USER, period: 'weekly' });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.series)).toBe(true);
    expect(typeof res.body.average).toBe('number');
    expect(typeof res.body.streak).toBe('number');
    expect(typeof res.body.insightText).toBe('string');
  });
});
