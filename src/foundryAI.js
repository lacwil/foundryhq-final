import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function talkToFoundryBot(messages) {
  const chatMessages = messages.map(m => ({
    role: m.role,
    content: m.content
  }));

  const res = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: chatMessages,
    temperature: 0.7
  });

  return res.choices[0]?.message?.content?.trim();
}
