class InMemoryUserRepository {
  constructor() {
    this.usersById = new Map();
  }

  async getOrCreateUser(userId) {
    let user = this.usersById.get(userId);
    if (!user) {
      user = { id: userId, mood_logs: [], insights: {} };
      this.usersById.set(userId, user);
    }
    return user;
  }

  async addMoodLog(userId, moodLog) {
    const user = await this.getOrCreateUser(userId);
    user.mood_logs.push({ ...moodLog });
    return moodLog;
  }

  async getMoodLogsInRange(userId, startDateInclusive, endDateExclusive) {
    const user = await this.getOrCreateUser(userId);
    const start = startDateInclusive.getTime();
    const end = endDateExclusive.getTime();
    return user.mood_logs.filter((log) => {
      const t = new Date(log.date).getTime();
      return t >= start && t < end;
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
    return user.insights;
  }
}

module.exports = InMemoryUserRepository;
