import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.post('/generate-logo', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const dalleRes = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        n: 1,
        size: '512x512',
        response_format: 'url',
      }),
    });

    const data = await dalleRes.json();
    const imageUrl = data.data?.[0]?.url;

    if (!imageUrl) throw new Error('No image URL returned');

    res.json({ image: imageUrl });
  } catch (error) {
    console.error('Logo generation error:', error);
    res.status(500).json({ error: error.message || 'Image generation failed' });
  }
});

export default router;
