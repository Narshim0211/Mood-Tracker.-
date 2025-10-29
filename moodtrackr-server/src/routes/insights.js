const express = require('express');
const { z } = require('zod');
const { User } = require('../models/User');
const { summarizeInsights } = require('../services/insightService');

const router = express.Router();

const Query = z.object({
  userId: z.string().min(1),
  period: z.enum(['weekly', 'monthly']).default('weekly'),
});

/**
 * @swagger
 * /insights/summary:
 *   get:
 *     summary: Get insights summary for dashboard
 *     tags: [Insights]
 */
router.get('/summary', async (req, res, next) => {
  try {
    const parsed = Query.safeParse({ userId: req.query.userId, period: req.query.period || 'weekly' });
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid query', details: parsed.error.flatten() });
    }
    const { userId, period } = parsed.data;
    const user = await User.findOne({ id: userId });
    const allLogs = user?.mood_logs || [];
    const summary = summarizeInsights({ allLogs, period });
    return res.json(summary);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
