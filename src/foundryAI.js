import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.error('❌ Missing VITE_OPENAI_API_KEY in environment variables');
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
