// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt in request body' });
    }

    const chat = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are FoundryBot, a business-building AI co-founder. Respond with practical and positive advice to help build the user’s idea into a real company, one step at a time.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'gpt-4',
      temperature: 0.7,
    });

    const reply = chat.choices[0].message.content;
    res.json({
      reply,
      canvas: `<div><strong>🛠️ AI Suggestion:</strong><br/>${reply.replace(/\n/g, '<br/>')}</div>`
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
