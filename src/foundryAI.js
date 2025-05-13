import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // VITE_ prefix required for Vercel frontend access
  dangerouslyAllowBrowser: true, // ⚠️ Allow client-side access (needed for browser use)
});

export async function talkToFoundryBot(messages) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('❌ OpenAI request failed:', error);
    return 'There was an error communicating with FoundryBot.';
  }
}
