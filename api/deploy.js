// No unauthenticated HTTP deployment trigger. Owner-approved deployments use deploy.js.
export default function handler(req, res) {
  return res.status(503).json({ error: 'HTTP deployments are disabled pending authentication and approval controls.' });
}
