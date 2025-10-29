const mongoose = require('mongoose');

const MoodLogSchema = new mongoose.Schema(
  {
    date: { type: Date, default: () => new Date(), index: true },
    emoji: { type: String, required: true },
    scale: { type: Number, required: true, min: 1, max: 10, index: true },
    triggers: [{ type: String }],
    tip: { type: String },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    mood_logs: { type: [MoodLogSchema], default: [] },
    insights: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Compound index for efficient queries by date and scale
UserSchema.index({ 'mood_logs.date': 1 });
UserSchema.index({ 'mood_logs.scale': 1 });

const User = mongoose.model('User', UserSchema);

module.exports = { User };
