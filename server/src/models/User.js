const mongoose = require('mongoose');

const MoodLogSchema = new mongoose.Schema(
  {
    date: { type: Date, default: () => new Date(), index: true },
    emoji: { type: String, required: true },
    scale: { type: Number, min: 1, max: 10, required: true, index: true },
    triggers: [{ type: String }],
    tip: { type: String },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    // For MVP, no auth; accept passed userId
    _id: { type: String, alias: 'id' },
    insights: { type: Object, default: {} },
    mood_logs: { type: [MoodLogSchema], default: [] },
  },
  { timestamps: true, minimize: false }
);

UserSchema.index({ 'mood_logs.date': 1 });
UserSchema.index({ 'mood_logs.scale': 1 });

const User = mongoose.model('User', UserSchema);

module.exports = { User };
