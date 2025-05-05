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
  const getStageKey = (project) => `foundry_stage_${project}`;

  const getSavedProjects = () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('foundry_chat_'));
    const base = keys.map(k => k.replace('foundry_chat_', ''));
    return [...new Set([DEFAULT_PROJECT, ...base])];
  };

  const getStage = () => localStorage.getItem(getStageKey(selectedProject)) || 'ask_business_type';
  const setStage = (stage) => localStorage.setItem(getStageKey(selectedProject), stage);

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
      const firstPrompt = funnelPrompt('ask_business_type', '');
      const botMsg = { sender: 'bot', text: firstPrompt };
      const initialMessages = [botMsg];
      saveMessages(initialMessages);
    }
  }, [selectedProject]);

  const funnelPrompt = (stage, userInput) => {
    switch (stage) {
      case 'ask_business_type':
        setStage('ask_product_type');
        return `🧠 FoundryBot: What is your newest empire going to be?`;
      case 'ask_product_type':
        setStage('ask_target_customer');
        return `Great! What kind of products or services will your business offer?`;
      case 'ask_target_customer':
        setStage('ask_supplier_help');
        return `Who is your ideal customer? (e.g. young professionals, pet owners, gym goers…)`;
      case 'ask_supplier_help':
        setStage('ask_platform');
        return `Would you like help finding suppliers or product sources for your niche?`;
      case 'ask_platform':
        setStage('ask_brand');
        return `Which platform would you like to use to launch? (Shopify, WooCommerce, etc)`;
      case 'ask_brand':
        setStage('build_name');
        return `Shall we brainstorm your brand name next?`;
      case 'build_name':
        setStage('next_steps');
        return `Suggesting brand names now based on: ${userInput}`;
      case 'next_steps':
        return `Next we'll check domains, design a logo, and build your site.`;
      default:
        return `🧠 FoundryBot: The user said: "${userInput}". Let's keep building their empire.`;
    }
  };

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

            try {
              const res = await fetch('http://localhost:3001/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: input }),
              });
              const data = await res.json();
              const botText = funnelPrompt(getStage(), input);
              const botMsg = { sender: 'bot', text: botText, canvas: data.response };
              saveMessages([...newMessages, botMsg]);
              setCanvasContent(data.response);
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
