const express = require('express');
const { z } = require('zod');
const { getUserRepository } = require('../config/datastore');
const { predictTriggers } = require('../services/aiTriggerService');
const { personalizeSuggestion } = require('../services/suggestionService');

const router = express.Router();

/**
 * @openapi
 * /api/mood:
 *   post:
 *     summary: Log a mood entry and get triggers and a suggestion
 *     tags: [Mood]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, emoji, scale]
 *             properties:
 *               userId:
 *                 type: string
 *               emoji:
 *                 type: string
 *               scale:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 10
 *               date:
 *                 type: string
 *                 format: date-time
 *               customTriggers:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Mood logged successfully
 */
router.post('/', async (req, res) => {
  const schema = z.object({
    userId: z.string().min(1),
    emoji: z.string().min(1),
    scale: z.number().int().min(1).max(10),
    date: z.string().datetime().optional(),
    customTriggers: z.array(z.string()).optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: parsed.error.flatten() });
  }

  const { userId, emoji, scale, date, customTriggers } = parsed.data;

  try {
    const repo = getUserRepository();
    const now = date ? new Date(date) : new Date();

    // Prepare current log
    const currentLog = { date: now, emoji, scale, triggers: [] };

    // Fetch last 7 days of logs
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recent = await repo.getMoodLogsInRange(userId, weekAgo, new Date(now.getTime() + 1));

    // Predict triggers
    const { triggers } = await predictTriggers({ recentLogs: recent, currentLog, customTriggers });

    // Personalize suggestion
    const tip = personalizeSuggestion(triggers, recent);

    // Save
    currentLog.triggers = triggers;
    currentLog.tip = tip;
    await repo.addMoodLog(userId, currentLog);

    return res.json({ ok: true, log: currentLog, triggers, tip });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ ok: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
