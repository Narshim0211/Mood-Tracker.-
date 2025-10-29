const mockProvider = require('./providers/mockProvider');
let openaiProvider = null;

function getProvider() {
  if (process.env.OPENAI_API_KEY) {
    // Lazy require to avoid dependency unless needed
    if (!openaiProvider) {
      openaiProvider = require('./providers/openaiProvider');
    }
    return openaiProvider;
  }
  return mockProvider;
}

async function detectTriggersFromLogs(logs) {
  const provider = getProvider();
  const top = await provider.detectTriggersFromLogs(logs || []);
  // Normalize strings
  return (top || []).map((s) => String(s).trim()).filter(Boolean);
}

module.exports = { detectTriggersFromLogs };
