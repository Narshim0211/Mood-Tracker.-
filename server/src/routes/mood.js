const express = require('express');
const { z } = require('zod');
const { User } = require('../models/User');
const { detectTriggersFromLogs } = require('../services/aiTriggerService');
const { chooseSuggestion } = require('../services/suggestionService');

const router = express.Router();

const MoodLogSchema = z.object({
  userId: z.string().min(1),
  emoji: z.string().min(1),
  scale: z.number().int().min(1).max(10),
  triggers: z.array(z.string()).optional(),
  tip: z.string().optional(),
  date: z.string().or(z.date()).optional(),
});

/**
 * POST /api/mood
 * Body: { userId, emoji, scale, triggers?, tip? }
 * Response: { ok, log, triggers, tip }
 */
router.post('/', async (req, res) => {
  const parse = MoodLogSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ ok: false, error: parse.error.flatten() });
  }
  const { userId, emoji, scale, triggers: customTriggers = [], tip: customTip, date } =
    parse.data;

  try {
    let user = await User.findById(userId);
    if (!user) {
      user = await User.create({ _id: userId });
    }

    const newLog = {
      date: date ? new Date(date) : new Date(),
      emoji,
      scale,
      triggers: customTriggers,
      tip: customTip,
    };

    user.mood_logs.push(newLog);

    // AI trigger detection based on past week
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recent = user.mood_logs.filter((l) => new Date(l.date) >= weekAgo);
    const aiTriggers = await detectTriggersFromLogs(recent);

    // Merge custom triggers
    const mergedTriggers = Array.from(new Set([...(customTriggers || []), ...aiTriggers]));

    const tip = chooseSuggestion({ logs: user.mood_logs, triggers: mergedTriggers });

    // Save with enriched data
    user.mood_logs[user.mood_logs.length - 1].triggers = mergedTriggers;
    user.mood_logs[user.mood_logs.length - 1].tip = tip;

    await user.save();

    return res.json({ ok: true, log: newLog, triggers: mergedTriggers, tip });
  } catch (e) {
    console.error('[mood] error:', e);
    return res.status(500).json({ ok: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
