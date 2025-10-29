// Optional: only used if OPENAI_API_KEY is available
const OpenAI = require('openai');

let client = null;

function getClient() {
  if (!client) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not set');
    }
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

async function detectTriggersFromLogs(logs) {
  const prompt = `You are a helpful assistant that analyzes recent mood logs (with date, emoji, scale 1-10) and predicts up to 3 likely triggers. Return only a JSON array of short strings.\nLogs: ${JSON.stringify(
    logs
  )}`;

  const completion = await getClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You return only compact JSON arrays.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.2,
  });

  const text = completion.choices?.[0]?.message?.content?.trim() || '[]';
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed.slice(0, 3);
  } catch (_e) {}
  return [];
}

module.exports = { detectTriggersFromLogs };
