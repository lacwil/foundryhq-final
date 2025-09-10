import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); // So we can use .env file for secrets

const router = express.Router();

router.post('/ask', async (req, res) => {
  const prompt = req.body.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4', // or 'gpt-3.5-turbo'
        messages: [
          { role: 'system', content: 'You are FoundryBot, a friendly assistant that builds websites and components.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    const reply = data.choices?.[0]?.message?.content || 'No reply received';

    res.json({ reply });
  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({ error: 'AI request failed' });
  }
});

export default router;
