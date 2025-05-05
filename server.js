import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/generate', async (req, res) => {
  const { messages } = req.body;

  if (!messages) {
    return res.status(400).json({ error: 'Messages are required' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
    });

    const reply = response.choices[0].message.content;

    res.json({
      reply,
      canvas: `<div><strong>🧠 AI Suggestion:</strong><br/>${reply.replace(/\n/g, '<br/>')}</div>`
    });
  } catch (err) {
    console.error('OpenAI API error:', err);
    res.status(500).json({ error: 'OpenAI API error', details: err.message });
  }
});

app.listen(3001, () => console.log('✅ Server running at http://localhost:3001'));
