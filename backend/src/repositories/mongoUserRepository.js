const mongoose = require('mongoose');
const User = require('../models/User');

class MongoUserRepository {
  constructor() {
    this.connected = false;
  }

  async connect(uri) {
    if (!this.connected) {
      await mongoose.connect(uri, { autoIndex: true });
      this.connected = true;
    }
  }

  async getOrCreateUser(userId) {
    let user = await User.findOne({ id: userId });
    if (!user) {
      user = await User.create({ id: userId, mood_logs: [], insights: {} });
    }
    return user;
  }

  async addMoodLog(userId, moodLog) {
    const user = await this.getOrCreateUser(userId);
    user.mood_logs.push({ ...moodLog });
    await user.save();
    return moodLog;
  }

  async getMoodLogsInRange(userId, startDateInclusive, endDateExclusive) {
    const user = await this.getOrCreateUser(userId);
    return user.mood_logs.filter((log) => {
      const t = new Date(log.date).getTime();
      return t >= startDateInclusive.getTime() && t < endDateExclusive.getTime();
    });
  }

  async getLatestLogs(userId, count) {
    const user = await this.getOrCreateUser(userId);
    const sorted = [...user.mood_logs].sort((a, b) => new Date(b.date) - new Date(a.date));
    return sorted.slice(0, count);
  }

  async getAllLogs(userId) {
    const user = await this.getOrCreateUser(userId);
    return [...user.mood_logs];
  }

  async setInsights(userId, insights) {
    const user = await this.getOrCreateUser(userId);
    user.insights = { ...(user.insights || {}), ...insights };
    await user.save();
    return user.insights;
  }
}

module.exports = MongoUserRepository;
