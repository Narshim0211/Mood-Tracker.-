const mongoose = require('mongoose');

const MoodLogSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now, index: true },
    emoji: { type: String, required: true },
    scale: { type: Number, min: 1, max: 10, required: true, index: true },
    triggers: [{ type: String }],
    tip: { type: String },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    mood_logs: [MoodLogSchema],
    insights: { type: Object, default: {} },
  },
  { timestamps: true, versionKey: false }
);

UserSchema.index({ 'mood_logs.date': 1 });
UserSchema.index({ 'mood_logs.scale': 1 });

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = { UserModel };
