const dayjs = require('dayjs');

function groupByDay(logs) {
  const map = new Map();
  for (const log of logs) {
    const key = dayjs(log.date).format('YYYY-MM-DD');
    const arr = map.get(key) || [];
    arr.push(log);
    map.set(key, arr);
  }
  return map;
}

function computeAveragesByDay(logs) {
  const byDay = groupByDay(logs);
  const result = [];
  for (const [date, arr] of byDay.entries()) {
    const avg = arr.reduce((a, b) => a + b.scale, 0) / arr.length;
    result.push({ date, averageScale: Number(avg.toFixed(2)) });
  }
  result.sort((a, b) => (a.date < b.date ? -1 : 1));
  return result;
}

function computeStreak(logs) {
  // Streak of consecutive days with average scale >= 6
  const daily = computeAveragesByDay(logs);
  let streak = 0;
  let prevDate = null;
  for (let i = daily.length - 1; i >= 0; i--) {
    const d = dayjs(daily[i].date);
    if (prevDate && !d.isSame(prevDate.subtract(1, 'day'), 'day')) break;
    if (daily[i].averageScale >= 6) {
      streak += 1;
      prevDate = d;
    } else {
      break;
    }
  }
  return streak;
}

function periodRange(period) {
  const now = dayjs();
  if (period === 'monthly') return { from: now.subtract(30, 'day'), to: now };
  return { from: now.subtract(7, 'day'), to: now };
}

function computeInsightText(currentAvg, previousAvg) {
  if (!previousAvg) return 'Start logging to unlock personalized insights.';
  const delta = currentAvg - previousAvg;
  const pct = previousAvg === 0 ? 0 : Math.round((delta / previousAvg) * 100);
  if (pct > 0) return `Great job — average mood up ${pct}% vs prior period.`;
  if (pct < 0) return `Tough patch — average mood down ${Math.abs(pct)}%. You got this.`;
  return 'Mood steady vs prior period.';
}

function summarizeInsights({ allLogs, period = 'weekly' }) {
  const { from, to } = periodRange(period);
  const current = allLogs.filter((l) => dayjs(l.date).isAfter(from) && dayjs(l.date).isBefore(to.add(1, 'day')));
  const previousFrom = from.subtract(period === 'monthly' ? 30 : 7, 'day');
  const previous = allLogs.filter((l) => dayjs(l.date).isAfter(previousFrom) && dayjs(l.date).isBefore(from));

  const currentDaily = computeAveragesByDay(current);
  const previousDaily = computeAveragesByDay(previous);

  const currentAvg = currentDaily.length ? currentDaily.reduce((a, b) => a + b.averageScale, 0) / currentDaily.length : 0;
  const previousAvg = previousDaily.length ? previousDaily.reduce((a, b) => a + b.averageScale, 0) / previousDaily.length : 0;

  const streak = computeStreak(allLogs);

  return {
    series: currentDaily,
    average: Number(currentAvg.toFixed(2)),
    streak,
    insightText: computeInsightText(currentAvg, previousAvg),
  };
}

module.exports = { computeAveragesByDay, computeStreak, summarizeInsights };
