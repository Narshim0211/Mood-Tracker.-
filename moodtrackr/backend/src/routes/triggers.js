const express = require('express');
const { getStore } = require('../store');
const { detectTriggers } = require('../services/aiTriggerService');

const router = express.Router();

/**
 * @openapi
 * /api/triggers/detect:
 *   post:
 *     summary: Predict likely triggers for a mood log
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emoji: { type: string }
 *               scale: { type: integer }
 *               triggers: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: List of inferred triggers
 */
router.post('/detect', async (req, res) => {
  const userId = 'demo';
  const store = getStore();
  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);
  const recentLogs = await store.getMoodLogs(userId, { since: oneWeekAgo });
  const triggers = await detectTriggers({ currentLog: req.body || {}, recentLogs });
  res.json({ triggers });
});

module.exports = router;
