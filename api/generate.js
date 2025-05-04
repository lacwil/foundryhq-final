// /api/generate.js
import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req, res) {
  const { prompt } = req.body;

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const reply = completion.data.choices[0].message.content;

    // Optional: handle dynamic canvas logic later
    const canvas = '';

    res.status(200).json({ reply, canvas });
  } catch (err) {
    console.error('OpenAI API error:', err.response?.data || err.message);
    res.status(500).json({ reply: 'Error calling OpenAI API.' });
  }
}
