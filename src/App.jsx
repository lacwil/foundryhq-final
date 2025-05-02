import { useState } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleGenerate = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.text);
      } else {
        setResponse('Error: ' + (data.error || 'Something went wrong.'));
      }
    } catch (err) {
      setResponse('Something went wrong.');
      console.error(err);
    }
  };

  return (
    <div className="app">
      <h1>🤖 FoundryBot</h1>
      <textarea
        placeholder="Enter your business idea prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
      />
      <button onClick={handleGenerate}>Generate</button>
      <h3>Response:</h3>
      <p>{response}</p>
    </div>
  );
}

export default App;
