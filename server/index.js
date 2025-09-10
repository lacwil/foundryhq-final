// server/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/generate-logo', async (req, res) => {
  const { prompt } = req.body;

  try {
    const imageResp = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "url",
    });

    const imageUrl = imageResp.data[0].url;
    res.json({ image: imageUrl });
  } catch (err) {
    console.error("DALL·E error:", err);
    res.status(500).json({ error: "Image generation failed" });
  }
});

app.listen(port, () => {
  console.log(`✅ Logo generation server running at http://localhost:${port}`);
});
