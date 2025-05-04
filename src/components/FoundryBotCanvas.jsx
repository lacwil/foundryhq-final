import { useState } from 'react';

function FoundryBotCanvas() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Welcome to FoundryBot! What type of project would you like to start today?" }
  ]);
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const updatedMessages = [...messages, { role: 'user', content: input }];
    setMessages(updatedMessages);
    setInput('');

    try {
      const res = await fetch('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      });

      const data = await res.json();
      if (data.result) {
        setMessages([...updatedMessages, { role: 'bot', content: data.result }]);
        setResponse(data.result);
      } else {
        setMessages([...updatedMessages, { role: 'bot', content: 'Error generating response.' }]);
      }
    } catch (err) {
      setMessages([...updatedMessages, { role: 'bot', content: 'Error generating response.' }]);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">FoundryBot</h2>
        <ul className="space-y-4 text-gray-700">
          <li>New Chat</li>
          <li>Saved Prompts</li>
          <li>Settings</li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 p-6 bg-gray-50 overflow-y-auto break-words">
        <div className="flex flex-col space-y-4">
          {messages.map((msg, idx) => (
            <p
              key={idx}
              className="whitespace-pre-wrap break-words text-sm text-gray-800"
            >
              <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.content}
            </p>
          ))}
        </div>

        <div className="mt-auto flex items-center pt-6">
          <input
            className="flex-1 border rounded px-4 py-2 mr-4 text-sm"
            type="text"
            placeholder="Ask FoundryBot..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoundryBotCanvas;
