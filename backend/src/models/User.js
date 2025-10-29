const mongoose = require('mongoose');

const MoodLogSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now, index: true },
    emoji: { type: String, required: true },
    scale: { type: Number, required: true, min: 1, max: 10, index: true },
    triggers: [{ type: String }],
    tip: { type: String }
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    mood_logs: [MoodLogSchema],
    insights: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);
module.exports = User;
