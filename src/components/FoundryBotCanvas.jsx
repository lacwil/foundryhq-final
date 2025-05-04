import { useState } from 'react';

function FoundryBotCanvas() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Welcome to FoundryBot! What type of project would you like to start today?" }
  ]);
  const [input, setInput] = useState('');
  const [canvasOutput, setCanvasOutput] = useState('');

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
      const result = data.result || 'Error generating response.';
      setMessages([...updatedMessages, { role: 'bot', content: result }]);
      setCanvasOutput(result);
    } catch {
      const errorMsg = 'Error generating response.';
      setMessages([...updatedMessages, { role: 'bot', content: errorMsg }]);
      setCanvasOutput(errorMsg);
    }
  };

  return (
    <div className="flex h-screen w-screen font-sans">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">FoundryBot</h2>
        <ul className="space-y-2 mb-6 text-gray-700 text-sm">
          <li className="hover:text-black cursor-pointer">New Chat</li>
          <li className="hover:text-black cursor-pointer">Saved Prompts</li>
          <li className="hover:text-black cursor-pointer">Settings</li>
        </ul>

        {/* Message history */}
        <div className="flex-1 overflow-y-auto pr-2 mb-4 text-sm">
          {messages.map((msg, idx) => (
            <p key={idx} className="mb-2">
              <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.content}
            </p>
          ))}
        </div>

        {/* Input bar */}
        <div className="mt-auto flex items-center">
          <input
            className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm mr-2"
            type="text"
            placeholder="Ask FoundryBot..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            className="bg-black text-white px-4 py-1 rounded text-sm"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>

      {/* Main Canvas Output */}
      <div className="flex-1 bg-gray-50 p-10 overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Canvas Output:</h3>
        <div className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
          {canvasOutput || 'Nothing yet. Ask FoundryBot to start building!'}
        </div>
      </div>
    </div>
  );
}

export default FoundryBotCanvas;
