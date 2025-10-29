const mongoose = require('mongoose');

const MoodLogSchema = new mongoose.Schema({
  date: { type: Date, index: true },
  emoji: String,
  scale: { type: Number, index: true },
  triggers: [String],
  tip: String,
});

const UserSchema = new mongoose.Schema({
  _id: String,
  mood_logs: [MoodLogSchema],
  insights: { type: mongoose.Schema.Types.Mixed },
});

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

class MongoStore {
  constructor(uri) {
    this.uri = uri;
  }

  async connect() {
    if (mongoose.connection.readyState === 1) return;
    await mongoose.connect(this.uri);
  }

  async addMoodLog(userId, moodLog) {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $push: { mood_logs: moodLog } },
      { upsert: true, new: true }
    );
    return moodLog;
  }

  async getMoodLogs(userId, { since } = {}) {
    const user = await UserModel.findById(userId).lean();
    if (!user) return [];
    const logs = user.mood_logs || [];
    if (!since) return logs;
    return logs.filter(l => new Date(l.date) >= since);
  }

  async setInsights(userId, insights) {
    await UserModel.findByIdAndUpdate(userId, { $set: { insights } }, { upsert: true });
    return insights;
  }

  async getUser(userId) {
    let user = await UserModel.findById(userId).lean();
    if (!user) {
      user = { _id: userId, mood_logs: [], insights: {} };
    }
    return { id: user._id, mood_logs: user.mood_logs, insights: user.insights };
  }
}

module.exports = MongoStore;
