const express = require('express');
const { z } = require('zod');
const { addMoodLog, getMoodLogs } = require('../data/store');
const { pickSuggestion } = require('../services/suggestionService');

const router = express.Router();

const moodSchema = z.object({
  userId: z.string().min(1),
  date: z.string().datetime().optional(),
  emoji: z.string().min(1),
  scale: z.number().min(1).max(10),
  triggers: z.array(z.string()).optional().default([]),
});

/**
 * POST /api/mood
 * Body: { userId, emoji, scale, triggers?, date? }
 * Response: { ok, log, tip }
 */
router.post('/', (req, res, next) => {
  try {
    const payload = moodSchema.parse(req.body);
    const nowIso = new Date().toISOString();
    const log = {
      date: payload.date || nowIso,
      emoji: payload.emoji,
      scale: payload.scale,
      triggers: payload.triggers,
      tip: '',
    };

    addMoodLog(payload.userId, log);

    const recentLogs = getMoodLogs(payload.userId, {
      since: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    });

    const tip = pickSuggestion({ recentLogs });
    log.tip = tip;

    res.json({ ok: true, log, tip });
  } catch (err) {
    err.status = 400;
    next(err);
  }
});

/**
 * GET /api/mood?userId=...
 * Response: { logs }
 */
router.get('/', (req, res, next) => {
  try {
    const userId = String(req.query.userId || '').trim();
    if (!userId) throw Object.assign(new Error('userId is required'), { status: 400 });
    const logs = getMoodLogs(userId);
    res.json({ logs });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
