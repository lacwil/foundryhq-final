import { useState } from 'react';

function FoundryBotCanvas() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! What type of project do you want to start today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const res = await fetch('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      if (data.result) {
        setMessages([...newMessages, { sender: 'bot', text: data.result }]);
      } else {
        setMessages([...newMessages, { sender: 'bot', text: 'Error: No result returned.' }]);
      }
    } catch (err) {
      setMessages([...newMessages, { sender: 'bot', text: 'Error generating response.' }]);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-4 border-r shadow">
        <h2 className="text-2xl font-bold mb-4">FoundryBot</h2>
        <ul className="space-y-2 text-blue-700 font-medium">
          <li>New Chat</li>
          <li>Saved Prompts</li>
          <li>Settings</li>
        </ul>
      </aside>

      {/* Main Chat + Canvas */}
      <main className="flex-1 p-6 flex flex-col">
        <div className="flex-1 overflow-auto space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`text-${msg.sender === 'bot' ? 'gray' : 'blue'}-800`}>
              <strong>{msg.sender === 'bot' ? 'FoundryBot:' : 'You:'}</strong> {msg.text}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="mt-4 flex">
          <input
            type="text"
            value={input}
            placeholder="Ask FoundryBot..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 border border-gray-300 rounded px-3 py-2 mr-2"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}

export default FoundryBotCanvas;
