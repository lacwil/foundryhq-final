import React, { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = () => {
    // Replace this with your actual AI call
    setResponse(
      'Here are some funny t-shirt websites:\n' +
      '1. Snorg Tees - Offers a wide variety of witty and humorous t-shirts for men, women, and children.\n' +
      '2. Busted Tees - Known for their quirky and pop culture-inspired designs.\n' +
      '3. Threadless - A community-driven t-shirt company featuring funny and creative designs.\n' +
      '4. The Chivery - Offers irreverent and humorous t-shirts inspired by internet memes.\n' +
      '5. Look Human - Known for clever puns and unique designs.\n' +
      '6. 6 Dollar Shirts - Affordable funny t-shirts.\n' +
      '7. TeeFury - Limited edition, pop-culture-inspired t-shirts.\n' +
      '8. Redbubble - Artist-submitted funny t-shirts from around the world.'
    );
  };

  return (
    <div className="min-h-screen px-4 py-6 text-gray-900 bg-white">
      <h1 className="text-3xl font-bold mb-4">FoundryBot</h1>

      <nav className="mb-6">
        <ul className="list-disc list-inside space-y-1">
          <li><a href="#" className="text-blue-600 hover:underline">New Chat</a></li>
          <li><a href="#" className="text-blue-600 hover:underline">Saved Prompts</a></li>
          <li><a href="#" className="text-blue-600 hover:underline">Settings</a></li>
        </ul>
      </nav>

      <div className="font-semibold mb-2">AI Response:</div>
      <div className="whitespace-pre-wrap break-words max-w-full border p-4 rounded-md bg-gray-100 text-sm mb-6">
        {response}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border rounded px-3 py-1 w-full max-w-md"
          placeholder="Type something..."
        />
        <button
          onClick={handleSend}
          className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
