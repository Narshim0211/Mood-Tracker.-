const express = require('express');
const { z } = require('zod');
const { User } = require('../models/User');

const router = express.Router();

const QuerySchema = z.object({
  userId: z.string().min(1),
  range: z.enum(['weekly', 'monthly']).default('weekly'),
});

function avg(nums) {
  if (!nums.length) return 0;
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

/**
 * GET /api/insights?userId=...&range=weekly|monthly
 * Response: { ok, average, streakDays, series: [{ date, avg }], notes }
 */
router.get('/', async (req, res) => {
  const parse = QuerySchema.safeParse({
    userId: req.query.userId,
    range: req.query.range || 'weekly',
  });
  if (!parse.success) {
    return res.status(400).json({ ok: false, error: parse.error.flatten() });
  }
  const { userId, range } = parse.data;

  try {
    const user = await User.findById(userId);
    const logs = user?.mood_logs || [];
    if (!logs.length) {
      return res.json({ ok: true, average: 0, streakDays: 0, series: [], notes: [] });
    }

    const now = new Date();
    const days = range === 'weekly' ? 7 : 30;
    const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const recent = logs.filter((l) => new Date(l.date) >= start);

    // Group by day
    const byDay = new Map();
    for (const l of recent) {
      const d = new Date(l.date);
      const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
      if (!byDay.has(key)) byDay.set(key, []);
      byDay.get(key).push(l.scale);
    }

    const series = Array.from(byDay.entries())
      .map(([date, arr]) => ({ date, avg: avg(arr) }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const average = avg(recent.map((l) => l.scale));

    // Streak: consecutive days with scale >= 6
    let streak = 0;
    let cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    while (true) {
      const key = cursor.toISOString();
      const entry = byDay.get(key);
      if (entry && avg(entry) >= 6) {
        streak += 1;
        cursor = new Date(cursor.getTime() - 24 * 60 * 60 * 1000);
      } else {
        break;
      }
    }

    const notes = [];
    if (average >= 7) notes.push('Great average mood — keep the habits that work!');
    if (average < 5) notes.push('Consider consistent sleep and hydration.');

    return res.json({ ok: true, average, streakDays: streak, series, notes });
  } catch (e) {
    console.error('[insights] error:', e);
    return res.status(500).json({ ok: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
