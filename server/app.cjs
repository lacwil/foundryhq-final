const express = require('express');
const { timingSafeEqual } = require('node:crypto');

const SYSTEM_PROMPT = 'You are FoundryBot, a startup cofounder assistant. Help build businesses step by step. Ask one clear question at a time. Return plain text; executable HTML previews are disabled.';

function createApp({ apiKey = process.env.OPENAI_API_KEY, password = process.env.LOCAL_API_PASSWORD, fetchImpl = globalThis.fetch } = {}) {
  const app = express();
  app.disable('x-powered-by');
  // This API is for loopback development only. Do not expose it publicly without authentication.
  app.use((req, res, next) => {
    const origin = req.get('origin');
    if (origin && !['http://127.0.0.1:5173', 'http://localhost:5173'].includes(origin)) {
      return res.status(403).json({ error: 'Origin not allowed' });
    }
    next();
  });
  app.use((req, res, next) => {
    if (!password) return res.status(503).json({ error: 'Local API authentication is not configured' });
    const expected = Buffer.from(`Basic ${Buffer.from(`foundry:${password}`).toString('base64')}`);
    const supplied = Buffer.from(req.get('authorization') || '');
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
      res.set('WWW-Authenticate', 'Basic realm="Foundry local development", charset="UTF-8"');
      return res.status(401).json({ error: 'Local API authentication required' });
    }
    next();
  });
  app.get('/api/health', (req, res) => res.json({ status: 'ok', aiConfigured: Boolean(apiKey) }));
  app.use(express.json({ limit: '64kb' }));
  app.post('/api/talk', async (req, res) => {
    const messages = req.body?.messages;
    if (!Array.isArray(messages) || messages.length < 1 || messages.length > 50 ||
        messages.some(m => !m || !['user', 'assistant'].includes(m.role) ||
          typeof m.content !== 'string' || !m.content.trim() || m.content.length > 8000) ||
        messages.at(-1).role !== 'user') {
      return res.status(400).json({ error: 'Provide 1–50 user/assistant messages ending with a user message (maximum 8000 characters each).' });
    }
    if (!apiKey) return res.status(503).json({ error: 'Server AI credentials are not configured' });
    try {
      const upstream = await fetchImpl('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gpt-4', messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.map(({ role, content }) => ({ role, content })),
        ], temperature: 0.7, max_tokens: 1500 }),
        signal: AbortSignal.timeout(30000),
      });
      if (!upstream.ok) return res.status(502).json({ error: 'AI provider request failed' });
      const data = await upstream.json();
      const message = data.choices?.[0]?.message?.content;
      if (typeof message !== 'string' || !message.trim()) {
        return res.status(502).json({ error: 'AI provider returned no message' });
      }
      return res.json({ message: message.trim() });
    } catch {
      return res.status(502).json({ error: 'AI provider request failed' });
    }
  });
  app.use((err, req, res, next) => {
    res.status(err.type === 'entity.too.large' ? 413 : 400).json({ error: 'Invalid request body' });
  });
  return app;
}
module.exports = { createApp };
