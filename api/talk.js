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

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
    });

    return res.status(200).json({
      message: completion.choices[0].message.content.trim(),
    });
  } catch (error) {
    console.error('OpenAI Server Error:', error);
    return res.status(500).json({ error: 'Server failed to fetch response from OpenAI' });
  }
}
