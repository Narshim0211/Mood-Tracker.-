const users = new Map();

function getUserFromMemory(userId) {
  if (!users.has(userId)) {
    users.set(userId, {
      _id: userId,
      mood_logs: [],
      insights: {},
    });
  }
  return users.get(userId);
}

function saveMoodLogToMemory(userId, log) {
  const user = getUserFromMemory(userId);
  user.mood_logs.push(log);
  return user;
}

function getRecentLogsFromMemory(userId, days = 7) {
  const user = getUserFromMemory(userId);
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  return user.mood_logs.filter((l) => new Date(l.date).getTime() >= since);
}

function getAllUsersInMemory() {
  return Array.from(users.values());
}

module.exports = {
  getUserFromMemory,
  saveMoodLogToMemory,
  getRecentLogsFromMemory,
  getAllUsersInMemory,
};
