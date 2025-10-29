const express = require('express');
const { getStore } = require('../store');
const { averageMoodScale, streakDays } = require('../utils/stats');

const router = express.Router();

/**
 * @openapi
 * /api/insights/summary:
 *   get:
 *     summary: Get insights summary for week or month
 *     parameters:
 *       - in: query
 *         name: range
 *         schema: { type: string, enum: [week, month] }
 *     responses:
 *       200:
 *         description: Insights data including average mood and streak
 */
router.get('/summary', async (req, res) => {
  const userId = 'demo';
  const range = req.query.range || 'week';
  const store = getStore();
  const now = new Date();
  const since = new Date(now);
  if (range === 'week') since.setDate(now.getDate() - 7);
  if (range === 'month') since.setMonth(now.getMonth() - 1);

  const logs = await store.getMoodLogs(userId, { since });
  const avg = averageMoodScale(logs);
  const streak = streakDays(await store.getMoodLogs(userId));

  // Build simple timeseries: average mood per day
  const byDay = {};
  for (const l of logs) {
    const key = new Date(l.date).toISOString().slice(0, 10);
    if (!byDay[key]) byDay[key] = [];
    byDay[key].push(l.scale);
  }
  const series = Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, vals]) => ({ date, avg: vals.reduce((a, v) => a + v, 0) / vals.length }));

  // Simple insight
  const insight = avg >= 7
    ? 'Great trend! Keep reinforcing what works.'
    : avg <= 4
      ? 'Consider short breaks, hydration, and a walk.'
      : 'Solid consistency. Small improvements add up.';

  res.json({ average: isNaN(avg) ? null : avg, streak, series, message: insight });
});

module.exports = router;
