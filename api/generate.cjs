export default async function handler(req, res) {
  const { prompt } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are FoundryBot. Respond with a helpful message and include HTML content in a `canvas` field for visual preview if applicable." },
        { role: "user", content: prompt }
      ]
    })
  });

  const result = await response.json();

  const fullText = result.choices?.[0]?.message?.content || "";
  const [reply, canvas] = fullText.split("<!--canvas-->");

  res.status(200).json({
    reply: reply.trim(),
    canvas: canvas ? canvas.trim() : ""
  });
}
