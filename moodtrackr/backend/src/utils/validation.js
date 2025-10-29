const Joi = require('joi');

const moodLogSchema = Joi.object({
  date: Joi.date().iso().optional(),
  emoji: Joi.string().required(),
  scale: Joi.number().integer().min(1).max(10).required(),
  triggers: Joi.array().items(Joi.string()).default([]),
  tip: Joi.string().optional(),
});

module.exports = { moodLogSchema };
