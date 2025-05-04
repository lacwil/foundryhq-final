import { useState } from 'react';

export default function FoundryBotCanvas() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Welcome to FoundryBot! What type of project would you like to start today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();
      setMessages([...newMessages, { role: 'bot', content: data.result || 'Error generating response.' }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'bot', content: 'Error generating response.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 space-y-4">
        <h1 className="text-2xl font-bold">FoundryBot</h1>
        <ul className="space-y-2">
          <li className="hover:underline cursor-pointer">New Chat</li>
          <li className="hover:underline cursor-pointer">Saved Prompts</li>
          <li className="hover:underline cursor-pointer">Settings</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-white p-6 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 pr-4">
          {messages.map((msg, i) => (
            <div key={i} className={`whitespace-pre-line ${msg.role === 'user' ? 'text-blue-700' : 'text-gray-800 font-medium'}`}>
              <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.content}
            </div>
          ))}
          {loading && <p className="text-gray-500 italic">Thinking...</p>}
        </div>

        {/* Input */}
        <div className="flex mt-4 border-t pt-4">
          <input
            type="text"
            className="flex-1 border rounded-l px-4 py-2 text-black"
            placeholder="Ask FoundryBot..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-6 rounded-r hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}
