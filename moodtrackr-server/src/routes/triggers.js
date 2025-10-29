const express = require('express');
const { z } = require('zod');
const { predictTriggers } = require('../services/aiTriggerService');
const { User } = require('../models/User');
const dayjs = require('dayjs');

const router = express.Router();

const PredictBody = z.object({
  userId: z.string().min(1),
  emoji: z.string().min(1),
  scale: z.number().int().min(1).max(10),
  date: z.coerce.date().optional(),
});

/**
 * @swagger
 * /triggers/predict:
 *   post:
 *     summary: Predict likely triggers for a mood log (no persistence)
 *     tags: [Triggers]
 */
router.post('/predict', async (req, res, next) => {
  try {
    const parsed = PredictBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid body', details: parsed.error.flatten() });
    }
    const { userId, emoji, scale, date } = parsed.data;

    const user = await User.findOne({ id: userId });
    const oneWeekAgo = dayjs().subtract(7, 'day').toDate();
    const pastWeek = user ? user.mood_logs.filter((l) => l.date >= oneWeekAgo) : [];

    const current = { date: date || new Date(), emoji, scale };
    const predicted = await predictTriggers({ userId, recentLogs: pastWeek, current });

    return res.json({ triggers: predicted });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
