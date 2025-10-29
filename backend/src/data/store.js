// Simple in-memory store with per-user data
// This can be swapped for MongoDB later by implementing the same interface

const users = new Map();

function getOrCreateUser(userId) {
  if (!users.has(userId)) {
    users.set(userId, { id: userId, mood_logs: [], insights: {} });
  }
  return users.get(userId);
}

function addMoodLog(userId, log) {
  const user = getOrCreateUser(userId);
  user.mood_logs.push(log);
  return log;
}

function getMoodLogs(userId, { since } = {}) {
  const user = getOrCreateUser(userId);
  if (!since) return [...user.mood_logs];
  const sinceTime = since.getTime();
  return user.mood_logs.filter((l) => new Date(l.date).getTime() >= sinceTime);
}

function setInsights(userId, insights) {
  const user = getOrCreateUser(userId);
  user.insights = insights;
  return user.insights;
}

function getUser(userId) {
  return getOrCreateUser(userId);
}

module.exports = {
  addMoodLog,
  getMoodLogs,
  setInsights,
  getUser,
};
