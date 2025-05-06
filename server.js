// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { OpenAI } from 'openai';
import fetch from 'node-fetch';

dotenv.config();
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'No prompt provided' });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    const reply = completion.choices[0].message.content;
    const canvas = `<div><strong>🧠 AI Suggestion:</strong><br/>${reply.replace(/\n/g, '<br/>')}</div>`;
    res.json({ reply, canvas });
  } catch (err) {
    console.error('OpenAI API error:', err);
    res.status(500).json({ error: 'OpenAI request failed' });
  }
});

app.get('/api/domain-check', async (req, res) => {
  const query = req.query.query || '';
  const suggestions = [
    `${query}.com`,
    `${query.replace(/\s+/g, '')}.co`,
    `${query.replace(/\s+/g, '')}store.com`,
    `${query.replace(/\s+/g, '')}hq.com`
  ];

  const results = suggestions.map(domain => ({
    domain,
    availability: Math.random() > 0.3 ? 'Available' : 'Taken'
  }));

  res.json({ results });
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
