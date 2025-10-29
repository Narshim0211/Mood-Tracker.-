const express = require('express');
const { z } = require('zod');
const { getUserRepository } = require('../config/datastore');
const { predictTriggers } = require('../services/aiTriggerService');

const router = express.Router();

/**
 * @openapi
 * /api/triggers:
 *   post:
 *     summary: Predict likely triggers based on recent logs
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Trigger predictions
 */
router.post('/', async (req, res) => {
  const schema = z.object({ userId: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: parsed.error.flatten() });
  }

  try {
    const { userId } = parsed.data;
    const repo = getUserRepository();
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recent = await repo.getMoodLogsInRange(userId, weekAgo, now);

    // Use a neutral current log to get general triggers
    const currentLog = { date: now, emoji: '😌', scale: 5, triggers: [] };
    const { triggers } = await predictTriggers({ recentLogs: recent, currentLog, customTriggers: [] });

    return res.json({ ok: true, triggers });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ ok: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
