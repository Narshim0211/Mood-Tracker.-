const express = require('express');
const { z } = require('zod');
const { User } = require('../models/User');
const { detectTriggersFromLogs } = require('../services/aiTriggerService');

const router = express.Router();

const BodySchema = z.object({ userId: z.string().min(1) });

/**
 * POST /api/triggers
 * Body: { userId }
 * Response: { ok, triggers }
 */
router.post('/', async (req, res) => {
  const parse = BodySchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ ok: false, error: parse.error.flatten() });
  }
  const { userId } = parse.data;

  try {
    const user = await User.findById(userId);
    const logs = user?.mood_logs || [];
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recent = logs.filter((l) => new Date(l.date) >= weekAgo);

    const triggers = await detectTriggersFromLogs(recent);
    return res.json({ ok: true, triggers });
  } catch (e) {
    console.error('[triggers] error:', e);
    return res.status(500).json({ ok: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
