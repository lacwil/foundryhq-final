import React, { useState } from 'react';

function ChatCanvas() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Welcome to FoundryBot! What type of project would you like to start today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      });

      const data = await res.json();
      const botMessage = { role: 'bot', text: data.result || 'Something went wrong.' };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Error generating response.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-1/4 bg-white p-4 border-r">
        <h2 className="text-xl font-bold mb-4">FoundryBot</h2>
        <ul className="text-sm space-y-2">
          <li>New Chat</li>
          <li>Saved Prompts</li>
          <li>Settings</li>
        </ul>
      </div>
      <div className="flex-1 flex flex-col p-6">
        <div className="flex-1 overflow-y-auto space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-md max-w-xl ${
                msg.role === 'bot' ? 'bg-blue-100 self-start' : 'bg-gray-300 self-end'
              }`}
            >
              <strong>{msg.role === 'bot' ? 'Bot: ' : 'You: '}</strong>{msg.text}
            </div>
          ))}
        </div>
        <div className="mt-4 flex">
          <input
            className="flex-1 p-2 border rounded"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask FoundryBot..."
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button
            className="ml-2 px-4 py-2 border rounded bg-white hover:bg-gray-100"
            onClick={handleSend}
            disabled={isLoading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatCanvas;
