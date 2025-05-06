// /api/domainCheck.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

// Example using Domainr API (you'll need to get a free API key at domainr.com)
const DOMAINR_API = 'https://api.domainr.com/v2/status';
const DOMAINR_KEY = process.env.DOMAINR_API_KEY;

router.post('/check', async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ error: 'Missing name' });

  const domain = `${name.replace(/\s+/g, '').toLowerCase()}.com`;

  try {
    const result = await axios.get(`${DOMAINR_API}?mashape-key=${DOMAINR_KEY}&domain=${domain}`);
    const status = result.data.status[0].status;

    if (status.includes('inactive')) {
      return res.json({ domain, available: true });
    } else {
      return res.json({ domain, available: false });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Domain check failed' });
  }
});

export default router;
