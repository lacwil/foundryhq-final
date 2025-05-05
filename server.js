import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json()); // ✅ Needed to parse JSON in POST body

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OpenAI API key' });
  }

  try {
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await completion.json();

    if (data.error) {
      console.error("OpenAI error:", data.error);
      return res.status(500).json({ error: 'Error from OpenAI API' });
    }

    const reply = data.choices?.[0]?.message?.content?.trim();

    return res.status(200).json({
      reply,
      canvas: `<div><strong>🛠️ AI Suggestion:</strong><br/>${reply}</div>`
    });
  } catch (err) {
    console.error("Handler error:", err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ API server listening on http://localhost:${PORT}`);
});
