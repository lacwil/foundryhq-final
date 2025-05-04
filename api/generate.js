import { config } from 'dotenv';
config();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'No prompt provided' });

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('OpenAI API Error:', result);
      return res.status(500).json({ error: 'OpenAI API error', details: result });
    }

    const reply = result.choices?.[0]?.message?.content?.trim() || "Sorry, I didn't get a response.";
    const canvas = ''; // later you’ll generate this dynamically

    res.status(200).json({ reply, canvas });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
}
