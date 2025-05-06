import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/generate', async (req, res) => {
  try {
    const messages = req.body.messages || [];

    const systemPrompt = `
You are FoundryBot, a friendly AI co-founder that helps users build, launch, and scale their business ideas.
You never suggest outsourcing or external developers. Instead, you act as the builder, tech expert, branding advisor, and launch assistant.

You ask one question at a time based on a structured funnel. Each question builds toward creating a real, working business.
Ask follow-up questions only when absolutely needed to help progress toward a finished app or website.

Your job is to turn an idea into a ready-to-launch business by:
1. Defining the brand
2. Suggesting names and checking domain availability
3. Generating logos and design style
4. Writing homepage copy and layout
5. Scaffolding app or website code
6. Planning hosting and deployment
7. Offering a marketing plan (ads, social, email)

If the user seems vague, guide them with practical examples.
Always respond with confidence, initiative, and progress.
    `.trim();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply, canvas: reply });
  } catch (err) {
    console.error('Error in /generate route:', err.message);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

export default router;
