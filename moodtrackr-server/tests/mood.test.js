const request = require('supertest');
const { app } = require('../src/app');
const { connectToDatabase, disconnectFromDatabase } = require('../src/db');

const TEST_USER = 'test-user-1';

beforeAll(async () => {
  process.env.USE_MEMORY_MONGO = 'true';
  await connectToDatabase();
});

afterAll(async () => {
  await disconnectFromDatabase();
});

describe('POST /mood', () => {
  it('logs mood and returns triggers and tip', async () => {
    const res = await request(app)
      .post('/mood')
      .send({ userId: TEST_USER, emoji: '😤', scale: 3 });

    expect(res.status).toBe(200);
    expect(res.body?.data?.triggers?.length).toBeGreaterThan(0);
    expect(typeof res.body?.data?.tip).toBe('string');
  });
});
