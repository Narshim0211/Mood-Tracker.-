class MemoryStore {
  constructor() {
    this.users = new Map(); // userId -> { mood_logs: [], insights: {} }
  }

  getOrCreateUser(userId) {
    if (!this.users.has(userId)) {
      this.users.set(userId, { id: userId, mood_logs: [], insights: {} });
    }
    return this.users.get(userId);
  }

  async addMoodLog(userId, moodLog) {
    const user = this.getOrCreateUser(userId);
    user.mood_logs.push(moodLog);
    return moodLog;
  }

  async getMoodLogs(userId, { since } = {}) {
    const user = this.getOrCreateUser(userId);
    const logs = user.mood_logs;
    if (!since) return logs;
    return logs.filter(l => new Date(l.date) >= since);
  }

  async setInsights(userId, insights) {
    const user = this.getOrCreateUser(userId);
    user.insights = insights;
    return insights;
  }

  async getUser(userId) {
    return this.getOrCreateUser(userId);
  }
}

module.exports = MemoryStore;
