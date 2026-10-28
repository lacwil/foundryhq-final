export async function askFoundryBot(messages) {
  const response = await fetch('/api/talk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: typeof messages === 'string' ? [{ role: 'user', content: messages }] : messages }),
  });
  const data = await response.json();
  if (!response.ok || typeof data.message !== 'string' || !data.message.trim()) {
    throw new Error('AI request failed. Check that the local API is running and configured.');
  }
  return data.message;
}
