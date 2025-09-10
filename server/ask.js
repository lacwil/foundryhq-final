import express from 'express';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import path from 'path';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

let session = {
  stage: 'idea',
  answers: {}
};

const openai = async (messages) => {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7
    })
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content || 'No response';
};

router.post('/ask', async (req, res) => {
  const userInput = req.body.prompt?.trim();
  if (!userInput) return res.status(400).json({ reply: 'Please provide an input.' });

  // IDEA STAGE (analyze idea before moving on)
  if (session.stage === 'idea') {
    session.answers.idea = userInput;
    session.stage = 'idea_analysis';

    const cleaned = userInput.replace(/^i\s+want\s+to\s+build\s+/i, '').trim();

    const analysisPrompt = `
Evaluate the following business idea: "${cleaned}"
- Give a short, thoughtful summary
- Mention any major competitors or similar apps on the market
- Ask the user: "What makes your version different from what's already out there?"
Keep it under 120 words.
    `;

    const feedback = await openai([
      { role: 'system', content: 'You are a startup coach evaluating ideas.' },
      { role: 'user', content: analysisPrompt }
    ]);

    return res.json({ reply: feedback });
  }

  // IDEA CLARIFICATION: "What makes yours different?"
  if (session.stage === 'idea_analysis') {
    session.answers.differentiator = userInput;
    session.stage = 'audience';
    return res.json({ reply: `Thanks! Now let’s shape this idea for the market.\n\nWho is your target customer?` });
  }

  // AUDIENCE
  if (session.stage === 'audience') {
    session.answers.audience = userInput;
    session.stage = 'uniqueness';
    return res.json({ reply: 'Awesome. What makes your product or idea unique?' });
  }

  // UNIQUENESS
  if (session.stage === 'uniqueness') {
    session.answers.uniqueness = userInput;
    session.stage = 'platform';
    return res.json({ reply: 'Got it. What type of platform do you want (website, app, landing page)?' });
  }

  // PLATFORM
  if (session.stage === 'platform') {
    session.answers.platform = userInput;
    session.stage = 'branding';
    return res.json({ reply: 'Nice. What kind of branding or visual style do you want?' });
  }

  // BRANDING
  if (session.stage === 'branding') {
    session.answers.branding = userInput;
    session.stage = 'namegen';

    const namePrompt = `
Suggest 5 brand/business name ideas for this startup:
- Idea: ${session.answers.idea}
- Audience: ${session.answers.audience}
- Unique value: ${session.answers.uniqueness}
- Platform: ${session.answers.platform}
- Style: ${session.answers.branding}
Names should be short, creative, and available as .com domains (if possible).
Only return the names as a bullet list.
    `;

    const nameList = await openai([
      { role: 'system', content: 'You are a branding expert that helps entrepreneurs name their business.' },
      { role: 'user', content: namePrompt }
    ]);

    return res.json({
      reply: `Here are 5 brand name ideas:\n\n${nameList}\n\nWhich one do you want to use? Or say "more" to generate more ideas.`
    });
  }

  // NAMEGEN SELECTION
  if (session.stage === 'namegen') {
    if (userInput.toLowerCase().includes('more')) {
      const namePrompt = `
Suggest 5 more brand/business name ideas for this startup:
- Idea: ${session.answers.idea}
- Audience: ${session.answers.audience}
- Unique value: ${session.answers.uniqueness}
- Platform: ${session.answers.platform}
- Style: ${session.answers.branding}
Only return names in a bullet list.
      `;

      const moreNames = await openai([
        { role: 'system', content: 'You are a branding expert that helps entrepreneurs name their business.' },
        { role: 'user', content: namePrompt }
      ]);

      return res.json({
        reply: `Here are more ideas:\n\n${moreNames}\n\nWhich one do you want to use?`
      });
    } else {
      session.answers.businessName = userInput;
      session.stage = 'domain';
      return res.json({
        reply: `✅ "${userInput}" it is! Next, I’ll check if a good domain name is available — hang tight...`
      });
    }
  }

  return res.json({ reply: 'Empire Builder session complete or unknown stage. Please open a new chat to start fresh.' });
});

export default router;
