import React, { useState } from 'react';

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Welcome to FoundryBot!' }
  ]);
  const [input, setInput] = useState('');
  const [canvasContent, setCanvasContent] = useState('');

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setCanvasContent('Generating response...');
    setInput('');

    try {
      const res = await fetch('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      if (data.result) {
        setMessages([...newMessages, { role: 'assistant', content: data.result }]);
        setCanvasContent(data.result);
      } else {
        setCanvasContent('No result returned.');
      }
    } catch (err) {
      setCanvasContent('Error generating response.');
    }
  };

  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar */}
      <aside className="w-[280px] bg-gray-900 text-white p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">🤖 FoundryBot</h1>
        <div className="flex-1 overflow-y-auto space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg text-sm ${
                msg.role === 'user' ? 'bg-gray-700 text-right' : 'bg-gray-800 text-left'
              }`}
            >
              <strong>{msg.role === 'user' ? 'You:' : 'Bot:'}</strong> {msg.content}
            </div>
          ))}
        </div>
      </aside>

      {/* Main chat & canvas */}
      <main className="flex-1 flex flex-col bg-white">
        <div className="flex-1 p-8 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">🧩 Canvas Output</h2>
          <div className="p-4 bg-gray-100 rounded-lg border text-gray-800 whitespace-pre-wrap min-h-[200px]">
            {canvasContent || 'Type a message to get started.'}
          </div>
        </div>

        {/* Input */}
        <div className="border-t p-4 bg-gray-50 flex items-center gap-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Send a message..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none"
          />
          <button
            onClick={handleSubmit}
            className="bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-black"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}
