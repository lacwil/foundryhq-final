export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("Missing API key.");
      return res.status(500).json({ error: 'Missing OpenAI API key' });
    }

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      console.error("OpenAI error response:", data);
      return res.status(500).json({ error: 'Error from OpenAI API' });
    }

    const reply = data.choices?.[0]?.message?.content?.trim() || "🤖 No response from AI.";

    res.status(200).json({
      reply,
      canvas: `<div><strong>🛠️ AI Suggestion:</strong><br/>${reply}</div>`
    });

  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
