export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      console.error("Missing API key in env");
      return res.status(500).json({ error: 'API key not set' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No reply from AI.';
    res.status(200).json({ reply, canvas: '' });
  } catch (err) {
    console.error('Fetch failed:', err);
    res.status(500).json({ error: 'Failed to fetch AI response.' });
  }
}
