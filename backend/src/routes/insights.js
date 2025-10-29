const express = require('express');
const { z } = require('zod');
const { getMoodLogs } = require('../data/store');

const router = express.Router();

const querySchema = z.object({
  userId: z.string().min(1),
  range: z.enum(['weekly', 'monthly']).default('weekly'),
});

function average(numbers) {
  if (!numbers.length) return 0;
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

/**
 * POST /api/insights
 * Body: { userId, range: 'weekly' | 'monthly' }
 * Response: { averages: { daily: Array<{ date, avg }> }, streak: string, insights: string[] }
 */
router.post('/', (req, res, next) => {
  try {
    const { userId, range } = querySchema.parse(req.body || {});

    const days = range === 'weekly' ? 7 : 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const logs = getMoodLogs(userId, { since });

    const byDay = new Map();
    for (const log of logs) {
      const day = new Date(log.date).toISOString().slice(0, 10);
      if (!byDay.has(day)) byDay.set(day, []);
      byDay.get(day).push(log.scale);
    }

    const daily = Array.from(byDay.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, scales]) => ({ date, avg: Math.round(10 * average(scales)) / 10 }));

    // Streak: consecutive days with logs and avg >= 6
    let streak = 0;
    let cursor = new Date();
    for (let i = 0; i < 30; i += 1) {
      const d = new Date(cursor.getTime() - i * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);
      const found = daily.find((x) => x.date === d && x.avg >= 6);
      if (found) streak += 1; else break;
    }

    const insightMessages = [];
    if (daily.length >= 2) {
      const firstHalfAvg = average(daily.slice(0, Math.floor(daily.length / 2)).map((d) => d.avg));
      const secondHalfAvg = average(daily.slice(Math.floor(daily.length / 2)).map((d) => d.avg));
      const delta = Math.round((secondHalfAvg - firstHalfAvg) * 10) / 10;
      if (delta > 0) insightMessages.push(`Mood improved +${delta} over this ${range}.`);
      if (delta < 0) insightMessages.push(`Mood dipped ${delta} over this ${range}.`);
    }

    res.json({ averages: { daily }, streak, insights: insightMessages });
  } catch (err) {
    err.status = 400;
    next(err);
  }
});

module.exports = router;
