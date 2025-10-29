const express = require('express');
const { z } = require('zod');
const { validate } = require('../middleware/validate.js');
const { mongoConnected } = require('../config/db.js');
const { UserModel } = require('../models/User.js');
const { getRecentLogsFromMemory } = require('../store/memoryStore.js');
const { predictTriggers } = require('../services/aiTriggerService.js');

const router = express.Router();

const predictSchema = z.object({
  body: z.object({
    userId: z.string().min(1),
  }),
});

/**
 * @openapi
 * /triggers/predict:
 *   post:
 *     summary: Predict triggers from last 7 days
 *     tags: [Triggers]
 */
router.post('/predict', validate(predictSchema), async (req, res) => {
  const { userId } = req.validated.body;

  let recentLogs = [];
  if (mongoConnected()) {
    const userDoc = await UserModel.findById(userId);
    if (userDoc) {
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      recentLogs = userDoc.mood_logs.filter((l) => l.date >= since);
    }
  } else {
    recentLogs = getRecentLogsFromMemory(userId, 7);
  }

  const triggers = await predictTriggers({ recentLogs });
  res.json({ triggers });
});

module.exports = router;
