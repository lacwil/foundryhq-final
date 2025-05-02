import { useState } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setResult(data.result || 'No response received.');
    } catch (error) {
      console.error('Error fetching:', error);
      setResult('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>FoundryBot</h1>
      <textarea
        placeholder="Ask FoundryBot something..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={5}
        cols={60}
      />
      <br />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate'}
      </button>
      <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
        <strong>Response:</strong>
        <p>{result}</p>
      </div>
    </div>
  );
}

export default App;
