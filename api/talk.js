// Public AI access stays closed until project authentication and rate limiting exist.
// The supported local development endpoint is in server/app.cjs.
export default function handler(req, res) {
  return res.status(503).json({ error: 'Public AI access is disabled pending authentication. Use the local development API.' });
}
