const express = require('express');
const { z } = require('zod');
const { AITriggerService } = require('../services/aiTriggerService');

const router = express.Router();
const aiService = new AITriggerService();

const requestSchema = z.object({
  userId: z.string().min(1),
});

/**
 * POST /api/triggers
 * Body: { userId }
 * Response: { triggers: string[], confidence: number, note: string }
 */
router.post('/', async (req, res, next) => {
  try {
    const { userId } = requestSchema.parse(req.body);
    const result = await aiService.detectTriggers({ userId });
    res.json(result);
  } catch (err) {
    err.status = 400;
    next(err);
  }
});

module.exports = router;
