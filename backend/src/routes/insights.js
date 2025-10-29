const express = require('express');
const { z } = require('zod');
const { getUserRepository } = require('../config/datastore');

const router = express.Router();

/**
 * @openapi
 * /api/insights:
 *   get:
 *     summary: Get mood insights and streaks
 *     tags: [Insights]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: period
 *         required: false
 *         schema:
 *           type: string
 *           enum: [week, month]
 *     responses:
 *       200:
 *         description: Insights data
 */
router.get('/', async (req, res) => {
  const schema = z.object({
    userId: z.string().min(1),
    period: z.enum(['week', 'month']).optional().default('week'),
  });
  const parsed = schema.safeParse({ userId: req.query.userId, period: req.query.period });
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: parsed.error.flatten() });
  }

  const { userId, period } = parsed.data;
  const repo = getUserRepository();

  try {
    const now = new Date();
    const days = period === 'month' ? 30 : 7;
    const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const logs = await repo.getMoodLogsInRange(userId, start, now);

    // Aggregate average per day
    const byDay = new Map();
    for (const log of logs) {
      const d = new Date(log.date);
      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
      const arr = byDay.get(key) || [];
      arr.push(log.scale);
      byDay.set(key, arr);
    }
    const series = Array.from(byDay.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([day, arr]) => ({ day, avg: arr.reduce((a, b) => a + b, 0) / arr.length }));

    // Streak: consecutive days where avg <= 5 (calm-ish) or custom rule
    let streak = 0;
    for (let i = series.length - 1; i >= 0; i -= 1) {
      if (series[i].avg <= 5) streak += 1;
      else break;
    }

    // Simple insight example
    const improvement = series.length >= 2 ? series[series.length - 1].avg - series[0].avg : 0;
    const insightText = improvement > 0
      ? `Mood improved by +${improvement.toFixed(1)} over this ${period}.`
      : improvement < 0
      ? `Mood decreased by ${improvement.toFixed(1)} over this ${period}.`
      : `Mood stable over this ${period}.`;

    return res.json({ ok: true, series, streak, insightText });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ ok: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
