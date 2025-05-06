import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/generate', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Missing or invalid message history' });
    }

    const fullMessages = [
      {
        role: 'system',
        content:
          "You are FoundryBot, a helpful AI co-founder that guides users step-by-step through building a business. Ask one question at a time and build toward delivering a complete, launch-ready business. Be helpful, conversational, and strategic."
      },
      ...messages
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: fullMessages,
      temperature: 0.7,
      max_tokens: 600
    });

    const reply = completion.choices[0].message.content.trim();

    return res.status(200).json({
      reply,
      canvas: `<div><strong>🧠 AI Suggestion:</strong><br/>${reply}</div>`
    });
  } catch (err) {
    console.error('OpenAI API error:', err);
    return res.status(500).json({ error: 'Failed to generate AI response.' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
