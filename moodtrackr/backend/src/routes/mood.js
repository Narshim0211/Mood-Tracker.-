const express = require('express');
const { z } = require('zod');
const { validate } = require('../middleware/validate.js');
const { mongoConnected } = require('../config/db.js');
const { UserModel } = require('../models/User.js');
const { getUserFromMemory, saveMoodLogToMemory, getRecentLogsFromMemory } = require('../store/memoryStore.js');
const { predictTriggers } = require('../services/aiTriggerService.js');
const { getSuggestion } = require('../services/suggestionService.js');

const router = express.Router();

const moodSchema = z.object({
  body: z.object({
    userId: z.string().min(1),
    emoji: z.string().min(1),
    scale: z.number().int().min(1).max(10),
    customTrigger: z.string().optional(),
  }),
});

/**
 * @openapi
 * /mood:
 *   post:
 *     summary: Log current mood and get triggers + suggestion
 *     tags: [Mood]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               emoji:
 *                 type: string
 *               scale:
 *                 type: integer
 *               customTrigger:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mood log saved with triggers and suggestion
 */
router.post('/', validate(moodSchema), async (req, res) => {
  const { userId, emoji, scale, customTrigger } = req.validated.body;

  const now = new Date();
  const currentLog = { date: now, emoji, scale, triggers: [], tip: '' };

  let recentLogs = [];
  let userDoc = null;

  if (mongoConnected()) {
    userDoc = await UserModel.findById(userId);
    if (!userDoc) {
      userDoc = await UserModel.create({ _id: userId, mood_logs: [], insights: {} });
    }
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    recentLogs = userDoc.mood_logs.filter((l) => l.date >= since);
  } else {
    recentLogs = getRecentLogsFromMemory(userId, 7);
  }

  const aiTriggers = await predictTriggers({ recentLogs, currentLog });
  const triggers = [...aiTriggers];
  if (customTrigger && customTrigger.trim()) triggers.push(customTrigger.trim());

  const tip = getSuggestion({ recentLogs, currentLog: { ...currentLog, triggers } });

  const fullLog = { ...currentLog, triggers, tip };

  if (mongoConnected()) {
    userDoc.mood_logs.push(fullLog);
    await userDoc.save();
  } else {
    saveMoodLogToMemory(userId, fullLog);
  }

  return res.json({ log: fullLog, triggers, tip });
});

module.exports = router;
