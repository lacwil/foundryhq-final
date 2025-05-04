export default async function handler(req, res) {
  const { prompt } = req.body;

  console.log('🔑 API key being used:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ OpenAI API error:', data);
      return res.status(500).json({ reply: 'Error from OpenAI API.' });
    }

    const reply = data.choices?.[0]?.message?.content || 'No reply.';
    return res.status(200).json({ reply, canvas: '' });
  } catch (err) {
    console.error('❌ Server error:', err);
    return res.status(500).json({ reply: 'Server error occurred.' });
  }
}
