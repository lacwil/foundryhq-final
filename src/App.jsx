import React, { useState, useEffect, useRef } from 'react';

const DEFAULT_PROJECT = 'Default Project';

function App() {
  const [input, setInput] = useState('');
  const [selectedProject, setSelectedProject] = useState(DEFAULT_PROJECT);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [canvasContent, setCanvasContent] = useState('');
  const chatEndRef = useRef(null);

  const getStorageKey = (project) => `foundry_chat_${project}`;

  const getSavedProjects = () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('foundry_chat_'));
    const base = keys.map(k => k.replace('foundry_chat_', ''));
    return [...new Set([DEFAULT_PROJECT, ...base])];
  };

  const loadMessages = (project) => {
    const saved = localStorage.getItem(getStorageKey(project));
    return saved ? JSON.parse(saved) : [];
  };

  const saveMessages = (msgs) => {
    setMessages(msgs);
    localStorage.setItem(getStorageKey(selectedProject), JSON.stringify(msgs));
  };

  useEffect(() => {
    setProjects(getSavedProjects());
    const msgs = loadMessages(selectedProject);
    setMessages(msgs);
    const lastBotMsg = [...msgs].reverse().find(m => m.sender === 'bot' && m.canvas);
    if (lastBotMsg) setCanvasContent(lastBotMsg.canvas);
    if (msgs.length === 0) {
      const botMsg = { sender: 'bot', text: `🧠 FoundryBot: What is your newest empire going to be?` };
      const initialMessages = [botMsg];
      saveMessages(initialMessages);
    }
  }, [selectedProject]);

  return (
    <div className="app">
      <div className="sidebar">
        <h2>FoundryBot</h2>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}>
          {projects.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <div className="chat-box">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.sender}`}>{msg.sender === 'user' ? `You: ${msg.text}` : msg.text}</div>
          ))}
          {isTyping && <div className="message bot">🧠 FoundryBot is thinking…</div>}
          <div ref={chatEndRef} />
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!input.trim()) return;

            const newMessages = [...messages, { sender: 'user', text: input }];
            saveMessages(newMessages);
            setInput('');
            setIsTyping(true);

            const chatHistory = newMessages.map((m) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text.replace('🧠 FoundryBot: ', '') }));

            try {
              const res = await fetch('http://localhost:3001/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: chatHistory })
              });
              const data = await res.json();
              const botText = `🧠 FoundryBot: ${data.reply}`;
              const botMsg = { sender: 'bot', text: botText, canvas: data.canvas };
              saveMessages([...newMessages, botMsg]);
              setCanvasContent(data.canvas);
            } catch (err) {
              const errMsg = { sender: 'bot', text: `❌ Failed to fetch AI response.` };
              saveMessages([...newMessages, errMsg]);
            }
            setIsTyping(false);
          }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
      <div className="canvas">
        <h1>Canvas Area</h1>
        <p>This is your interactive project area for: <strong>{selectedProject}</strong></p>
        <div className="canvas-content">
          <strong>🧠 AI Suggestion:</strong>
          <p>{canvasContent || 'No response.'}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
