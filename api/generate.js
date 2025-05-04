export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const prompt = req.body.prompt;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('Missing OpenAI API key');
    return res.status(500).json({ error: 'Missing OpenAI API key' });
  }

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are FoundryBot, a helpful assistant who helps users build businesses and apps from scratch." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      console.error('OpenAI API error:', data);
      return res.status(500).json({ error: 'Error from OpenAI API' });
    }

    const reply = data.choices?.[0]?.message?.content?.trim() || '';
    return res.status(200).json({ reply, canvas: '' }); // You can add canvas logic later
  } catch (err) {
    console.error('API call failed:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
