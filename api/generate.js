// api/generate.js

import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // ← should match what’s in Vercel and .env
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const reply = completion.data.choices[0]?.message?.content || 'No response generated.';
    res.status(200).json({ reply });
  } catch (error) {
    console.error('❌ OpenAI API Error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate response from OpenAI.' });
  }
}
