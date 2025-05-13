import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.warn('⚠️ VITE_OPENAI_API_KEY is missing. Please set it in your Vercel project settings.');
}

const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true,
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
