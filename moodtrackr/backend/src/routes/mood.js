const express = require('express');
const { getStore } = require('../store');
const { moodLogSchema } = require('../utils/validation');
const { detectTriggers } = require('../services/aiTriggerService');
const { pickSuggestion } = require('../services/suggestionService');

const router = express.Router();

// Common demo user until auth is added
function getUserId(req) {
  // In future, derive from auth token
  return 'demo';
}

/**
 * @openapi
 * /api/mood:
 *   post:
 *     summary: Create a mood log and get triggers/suggestion
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emoji:
 *                 type: string
 *               scale:
 *                 type: integer
 *               triggers:
 *                 type: array
 *                 items: { type: string }
 *               tip:
 *                 type: string
 *     responses:
 *       200:
 *         description: Created mood log with AI triggers and suggestion
 */
router.post('/', async (req, res) => {
  const userId = getUserId(req);
  const { value, error } = moodLogSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ error: error.details.map(d => d.message) });

  const store = getStore();
  const now = new Date();
  const date = value.date ? new Date(value.date) : now;

  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);
  const recentLogs = await store.getMoodLogs(userId, { since: oneWeekAgo });

  const inferredTriggers = await detectTriggers({ currentLog: value, recentLogs });
  const combinedTriggers = Array.from(new Set([...(value.triggers || []), ...inferredTriggers]));

  const suggestion = pickSuggestion({ triggers: combinedTriggers, recentLogs });

  const moodLog = {
    date: date.toISOString(),
    emoji: value.emoji,
    scale: value.scale,
    triggers: combinedTriggers,
    tip: suggestion,
  };

  await store.addMoodLog(userId, moodLog);

  res.json({
    mood_log: moodLog,
    triggers: combinedTriggers,
    tip: suggestion,
  });
});

/**
 * @openapi
 * /api/mood:
 *   get:
 *     summary: Get mood logs, optionally for a time range
 *     parameters:
 *       - in: query
 *         name: range
 *         schema: { type: string, enum: [week, month, all] }
 *     responses:
 *       200:
 *         description: List of mood logs
 */
router.get('/', async (req, res) => {
  const userId = getUserId(req);
  const store = getStore();
  const range = req.query.range || 'all';
  let since;
  const now = new Date();
  if (range === 'week') {
    since = new Date(now);
    since.setDate(now.getDate() - 7);
  } else if (range === 'month') {
    since = new Date(now);
    since.setMonth(now.getMonth() - 1);
  }
  const logs = await store.getMoodLogs(userId, { since });
  res.json({ mood_logs: logs });
});

module.exports = router;
