import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
    });

    res.status(200).json({ message: response.choices[0].message.content.trim() });
  } catch (error) {
    console.error('❌ OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to communicate with FoundryBot.' });
  }
}
