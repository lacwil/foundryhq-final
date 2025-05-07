import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { talkToFoundryBot } from './foundryAI';
import { saveAs } from 'file-saver';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('foundryMessages');
    return saved ? JSON.parse(saved) : [
      {
        role: "system",
        content: `You are FoundryBot, a GPT-4-powered AI assistant who works just like ChatGPT.
You are embedded in FoundryHQ — a platform to help users build real online businesses from scratch.

You have full freedom to:
- Discuss ideas conversationally
- Ask smart questions to clarify
- Generate and revise React, Node.js, and API code
- Save or modify project files
- Help the user build and deploy their project from start to finish

You are friendly, clever, proactive, and focused on implementation over theory.
If the user says something vague, always ask helpful questions or offer suggestions.
If the user says "implement" or "make it real" — write and save the code immediately.`
      },
      {
        role: "user",
        content: `My newest empire is an AI business-building platform with 3 tiers:
1. Growth Spark: Marketing for existing businesses
2. Launch Kit: Website + marketing for new businesses
3. Empire Mode: Fully guided AI-powered business creation with domain, site, and launch

Your job is to help me build the whole thing from scratch inside this app. Ask me what I want to create, and help me code it live.`
      }
    ];
  });

  const [renderedComponents, setRenderedComponents] = useState([]);
  const [pendingComponent, setPendingComponent] = useState(null);

  useEffect(() => {
    localStorage.setItem('foundryMessages', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    const reply = await talkToFoundryBot(newMessages);
    const updatedMessages = [...newMessages, { role: 'assistant', content: reply }];
    setMessages(updatedMessages);

    const implementMatch = input.match(/implement as (.+\.jsx)/i);
    if (implementMatch) {
      const filename = implementMatch[1];
      const componentName = filename.replace('.jsx', '');
      setPendingComponent({ filename, code: reply, componentName });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.ctrlKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === 'Enter' && e.ctrlKey) {
      setInput((prev) => prev + '\n');
    }
  };

  const handleImplement = async () => {
    try {
      const response = await fetch('http://localhost:3001/save-component', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filename: pendingComponent.filename,
          code: pendingComponent.code
        })
      });

      if (response.ok) {
        setRenderedComponents((prev) => [...prev, pendingComponent.componentName]);
        setPendingComponent(null);
      } else {
        alert('Failed to save file to components folder.');
      }
    } catch (error) {
      console.error('Error saving file:', error);
      alert('An error occurred while saving the file.');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Chat panel */}
      <div style={{ flex: 1, padding: 20, borderRight: '1px solid #ccc', overflowY: 'auto' }}>
        <h1>🧠 FoundryBot</h1>
        <div style={{ marginBottom: 10 }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                margin: '10px 0',
                padding: '10px 14px',
                backgroundColor: msg.role === 'assistant' ? '#f0f4ff' : '#e9f9ec',
                borderRadius: '8px',
                color: '#333',
                fontWeight: 'normal',
                maxWidth: '95%',
                whiteSpace: 'pre-wrap',
              }}
            >
              <strong style={{ display: 'block', marginBottom: 4 }}>
                {msg.role === 'assistant' ? '🧠 FoundryBot:' : '🧍 You:'}
              </strong>
              {msg.content}
            </div>
          ))}
        </div>
        <textarea
          rows={3}
          style={{ width: '100%', marginBottom: 10 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send, Ctrl+Enter for newline)"
        />
        <button onClick={handleSend}>Send</button>
      </div>

      {/* Rendered component panel */}
      <div style={{ flex: 1.5, padding: 20, overflowY: 'auto' }}>
        {renderedComponents.map((compName, idx) => {
          const Component = lazy(() => import(/* @vite-ignore */ `./components/${compName}.jsx`));
          return (
            <Suspense fallback={<div>Loading {compName}...</div>} key={idx}>
              <Component />
            </Suspense>
          );
        })}

        {pendingComponent && (
          <div style={{ marginTop: 20 }}>
            <h3>📦 Pending Component Preview: {pendingComponent.filename}</h3>
            <pre
              style={{
                background: '#f7f7f7',
                padding: '10px',
                borderRadius: '6px',
                whiteSpace: 'pre-wrap',
                fontSize: '0.9em',
                maxHeight: '300px',
                overflowY: 'auto',
              }}
            >
              {pendingComponent.code}
            </pre>
            <div style={{ marginTop: 10 }}>
              <button onClick={() => {
                setRenderedComponents((prev) => [...prev, pendingComponent.componentName]);
                setPendingComponent(null);
              }} style={{ marginRight: 10 }}>
                👁 Preview
              </button>
              <button onClick={handleImplement} style={{ marginRight: 10 }}>
                ✅ Implement
              </button>
              <button onClick={() => setPendingComponent(null)}>✏️ Make Changes</button>
            </div>
            <p style={{ fontSize: '0.85em', color: '#777', marginTop: 10 }}>
              💾 The component will be saved directly into <code>src/components/</code>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
