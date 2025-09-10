// src/utils/openai.js
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function askFoundryBot(prompt) {
  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "system", content: "You are FoundryBot, a startup co-founder assistant that helps users build online businesses step-by-step." },
               { role: "user", content: prompt }],
    temperature: 0.7,
  });

  return response.data.choices[0].message.content.trim();
}
