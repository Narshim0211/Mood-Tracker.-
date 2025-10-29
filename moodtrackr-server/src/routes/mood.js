const express = require('express');
const { z } = require('zod');
const { User } = require('../models/User');
const { predictTriggers, selectTip } = require('../services/aiTriggerService');
const dayjs = require('dayjs');

const router = express.Router();

const MoodBody = z.object({
  userId: z.string().min(1),
  emoji: z.string().min(1),
  scale: z.number().int().min(1).max(10),
  triggers: z.array(z.string()).optional().default([]),
  date: z.coerce.date().optional(),
});

/**
 * @swagger
 * /mood:
 *   post:
 *     summary: Log a mood entry and receive instant suggestion
 *     tags: [Mood]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId: { type: string }
 *               emoji: { type: string }
 *               scale: { type: integer, minimum: 1, maximum: 10 }
 *               triggers: { type: array, items: { type: string } }
 *               date: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Mood logged with predicted triggers and suggestion
 *       400:
 *         description: Invalid input
 */
router.post('/', async (req, res, next) => {
  try {
    const parsed = MoodBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid body', details: parsed.error.flatten() });
    }
    const { userId, emoji, scale, triggers: customTriggers, date } = parsed.data;

    let user = await User.findOne({ id: userId });
    if (!user) {
      user = await User.create({ id: userId, mood_logs: [], insights: {} });
    }

    // Pull past week logs
    const oneWeekAgo = dayjs().subtract(7, 'day').toDate();
    const pastWeek = user.mood_logs.filter((l) => l.date >= oneWeekAgo);

    const current = { date: date || new Date(), emoji, scale };
    const predicted = await predictTriggers({ userId, recentLogs: pastWeek, current });
    const mergedTriggers = Array.from(new Set([...(customTriggers || []), ...predicted]));
    const tip = selectTip({ recentLogs: pastWeek, current, triggers: mergedTriggers });

    const moodLog = { ...current, triggers: mergedTriggers, tip };
    user.mood_logs.push(moodLog);
    await user.save();

    return res.json({
      message: 'Mood logged successfully',
      data: { triggers: mergedTriggers, tip, moodLog },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
