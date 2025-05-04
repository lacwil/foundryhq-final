// File: api/generate.js

export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ reply: "No prompt provided" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ reply: "Missing OpenAI API key" });
    }

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const json = await openaiRes.json();

    if (openaiRes.status !== 200) {
      console.error('OpenAI error:', json);
      return res.status(500).json({ reply: "Error from OpenAI API" });
    }

    const reply = json.choices?.[0]?.message?.content || "No reply generated";

    res.status(200).json({
      reply,
      canvas: `<p><strong>Generated:</strong> ${reply}</p>`
    });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ reply: "Server error occurred" });
  }
}
