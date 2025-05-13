export async function talkToFoundryBot(messages) {
  try {
    const res = await fetch('/api/talk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    const data = await res.json();
    return data.message || 'No message returned.';
  } catch (error) {
    console.error('❌ Error talking to FoundryBot:', error);
    return 'There was an error communicating with FoundryBot.';
  }
}
