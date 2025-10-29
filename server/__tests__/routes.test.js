const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { createApp } = require('../src/app');

let mongod;
let app;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  app = createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

describe('routes', () => {
  test('POST /api/mood logs an entry and returns triggers and tip', async () => {
    const res = await request(app)
      .post('/api/mood')
      .send({ userId: 'u1', emoji: '😊', scale: 8 });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(Array.isArray(res.body.triggers)).toBe(true);
    expect(typeof res.body.tip).toBe('string');
  });

  test('GET /api/insights works for weekly range', async () => {
    await request(app).post('/api/mood').send({ userId: 'u2', emoji: '😌', scale: 7 });
    const res = await request(app).get('/api/insights').query({ userId: 'u2', range: 'weekly' });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(typeof res.body.average).toBe('number');
    expect(Array.isArray(res.body.series)).toBe(true);
  });
});
