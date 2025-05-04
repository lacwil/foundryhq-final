export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  console.log('Incoming prompt:', prompt);
  console.log('Using OpenAI Key:', apiKey ? '✅ exists' : '❌ missing');

  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not set.' });
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    const json = await openaiRes.json();
    console.log('OpenAI raw response:', JSON.stringify(json, null, 2));

    if (!openaiRes.ok || !json.choices) {
      return res.status(500).json({ error: 'OpenAI error', details: json });
    }

    const reply = json.choices[0].message.content;

    res.status(200).json({
      reply: reply.trim(),
      canvas: '', // leave empty for now until AI sends HTML
    });
  } catch (err) {
    console.error('API call failed:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
