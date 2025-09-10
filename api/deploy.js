import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

const VERCEL_DEPLOY_HOOK_URL = 'https://api.vercel.com/v1/integrations/deploy/prj_Obg7LAvXud6ekQJNVotM0uQcAHpz/LqfCbF3ECv';

router.post('/deploy', async (req, res) => {
  try {
    const response = await fetch(VERCEL_DEPLOY_HOOK_URL, { method: 'POST' });

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to trigger deployment.' });
    }

    return res.json({ message: '✅ Deployment triggered successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Deployment error.' });
  }
});

export default router;
