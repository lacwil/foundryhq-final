export default async function handler(req, res) {
  console.log("🔁 API HIT: /api/generate");

  const { prompt } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are FoundryBot, a helpful business builder assistant.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || "";

    const [reply, canvas] = content.split("<!--canvas-->");

    res.status(200).json({
      reply: reply.trim(),
      canvas: canvas ? canvas.trim() : "",
    });
  } catch (err) {
    console.error("❌ OpenAI API Error:", err);
    res.status(500).json({ reply: "❌ Failed to fetch AI response." });
  }
}
