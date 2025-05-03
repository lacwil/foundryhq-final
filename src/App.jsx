import React, { useState } from 'react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleGenerate = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setResponse(data.result || 'Error: No result returned');
    } catch (error) {
      setResponse('Error generating response.');
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-semibold mb-4">FoundryBot</h2>
        <ul className="space-y-2">
          <li className="hover:bg-gray-700 p-2 rounded">New Chat</li>
          <li className="hover:bg-gray-700 p-2 rounded">Saved Prompts</li>
          <li className="hover:bg-gray-700 p-2 rounded">Settings</li>
        </ul>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col p-6 bg-gray-100 overflow-y-auto">
        <div className="flex flex-col gap-4 flex-grow">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-medium">AI Response:</h3>
            <p className="mt-2 whitespace-pre-wrap">{response}</p>
          </div>
        </div>

        <div className="mt-6 flex">
          <input
            className="flex-grow p-3 border border-gray-300 rounded-l"
            placeholder="Ask FoundryBot..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            className="bg-black text-white px-6 rounded-r"
            onClick={handleGenerate}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
