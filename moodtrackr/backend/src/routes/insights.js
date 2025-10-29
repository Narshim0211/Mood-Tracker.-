const express = require('express');
const { z } = require('zod');
const { validate } = require('../middleware/validate.js');
const { mongoConnected } = require('../config/db.js');
const { UserModel } = require('../models/User.js');
const { getUserFromMemory } = require('../store/memoryStore.js');

const router = express.Router();

const summarySchema = z.object({
  query: z.object({
    userId: z.string().min(1),
    range: z.enum(['weekly', 'monthly']).default('weekly').optional(),
  }),
});

function computeAveragesByDay(logs) {
  const byDay = new Map();
  for (const l of logs) {
    const key = new Date(l.date).toISOString().slice(0, 10);
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key).push(l.scale);
  }
  const points = Array.from(byDay.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, scales]) => ({ date, average: scales.reduce((a, b) => a + b, 0) / scales.length }));
  return points;
}

function computeStreak(logs) {
  const byDate = new Map();
  for (const l of logs) {
    const key = new Date(l.date).toISOString().slice(0, 10);
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key).push(l.scale);
  }
  const dates = Array.from(byDate.keys()).sort();
  let streak = 0;
  for (let i = dates.length - 1; i >= 0; i--) {
    const avg = byDate.get(dates[i]).reduce((a, b) => a + b, 0) / byDate.get(dates[i]).length;
    if (avg <= 4) streak += 1;
    else break;
  }
  return streak;
}

function computeInsightText(logs) {
  const walkCount = logs.filter((l) => l.tip?.toLowerCase().includes('walk')).length;
  if (walkCount >= 2) return 'Walking appears to improve your mood this period.';
  return 'Keep logging consistently to unlock deeper insights.';
}

/**
 * @openapi
 * /insights/summary:
 *   get:
 *     summary: Get weekly or monthly mood insights
 *     tags: [Insights]
 */
router.get('/summary', validate(summarySchema), async (req, res) => {
  const { userId } = req.validated.query;
  const range = req.validated.query.range || 'weekly';

  let logs = [];
  if (mongoConnected()) {
    const userDoc = await UserModel.findById(userId);
    logs = userDoc?.mood_logs || [];
  } else {
    const user = getUserFromMemory(userId);
    logs = user.mood_logs;
  }

  const now = Date.now();
  const days = range === 'weekly' ? 7 : 30;
  const filtered = logs.filter((l) => new Date(l.date).getTime() >= now - days * 24 * 60 * 60 * 1000);
  const series = computeAveragesByDay(filtered);
  const streak = computeStreak(filtered);
  const insight = computeInsightText(filtered);

  res.json({ series, streak, insight });
});

module.exports = router;
