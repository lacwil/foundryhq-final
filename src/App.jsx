// Plan:
// 1. Get project list from external source (dashboard context)
// 2. Disable manual project add/rename
// 3. Save chat history per project in localStorage

import React, { useState, useEffect, useRef } from 'react';

const DEFAULT_PROJECT = 'Default Project';
const DASHBOARD_PROJECTS = ['Default Project', 'My Website', 'Fitness App']; // To be replaced with dynamic fetch

function App() {
  const [input, setInput] = useState('');
  const [selectedProject, setSelectedProject] = useState(DEFAULT_PROJECT);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef(null);

  const getStorageKey = (project) => `foundry_chat_${project}`;

  const loadMessages = (project) => {
    const saved = localStorage.getItem(getStorageKey(project));
    return saved ? JSON.parse(saved) : [];
  };

  const saveMessages = (msgs) => {
    setMessages(msgs);
    localStorage.setItem(getStorageKey(selectedProject), JSON.stringify(msgs));
  };

  useEffect(() => {
    setMessages(loadMessages(selectedProject));
  }, [selectedProject]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { sender: 'user', text: trimmed };
    const typingMsg = { sender: 'bot', text: 'FoundryBot is typing...' };

    const updated = [...messages, userMessage, typingMsg];
    saveMessages(updated);
    setInput('');
    setIsTyping(true);

    let reply = '';
    const lower = trimmed.toLowerCase();

    if (lower.includes('fitness')) {
      reply = '🏋️‍♂️ Fitness app ideas...';
    } else {
      reply = '🤖 No response for that yet.';
    }

    setTimeout(() => {
      const updatedWithReply = [...updated.slice(0, -1), { sender: 'bot', text: reply }];
      saveMessages(updatedWithReply);
      setIsTyping(false);
    }, 1000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '360px', borderRight: '1px solid #ddd', background: '#f9f9f9', padding: 20, display: 'flex', flexDirection: 'column' }}>
        <h2>FoundryBot</h2>

        <div style={{ marginBottom: 10 }}>
          <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} style={{ width: '100%', padding: '6px' }}>
            {DASHBOARD_PROJECTS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: 10 }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: msg.sender === 'user' ? '#d9fdd3' : '#fff',
                padding: 10,
                borderRadius: 8,
                marginBottom: 6,
                whiteSpace: 'pre-line'
              }}
            >
              <strong>{msg.sender === 'user' ? 'You' : '🤖 FoundryBot'}:</strong> {msg.text}
            </div>
          ))}
          {isTyping && <div style={{ fontStyle: 'italic' }}>FoundryBot is typing...</div>}
          <div ref={chatEndRef} />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your message..."
            rows={2}
            style={{ flex: 1, resize: 'none', padding: 10 }}
          />
          <button onClick={handleSend} style={{ padding: '10px 16px', background: '#000', color: '#fff' }}>Send</button>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ flexGrow: 1, padding: 40 }}>
        <h1>Canvas Area</h1>
        <p>This is your interactive project area for: <strong>{selectedProject}</strong></p>
      </div>
    </div>
  );
}

export default App;
