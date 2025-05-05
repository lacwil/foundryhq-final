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

  const nextStage = (stage) => {
    const stages = [
      'ask_business_type',
      'ask_product_type',
      'ask_target_customer',
      'ask_supplier_help',
      'ask_platform',
      'ask_brand',
      'build_name',
      'next_steps'
    ];
    const index = stages.indexOf(stage);
    return index >= 0 && index < stages.length - 1 ? stages[index + 1] : 'done';
  };

  const generateFunnelPrompt = (stage, userInput, project) => {
    switch (stage) {
      case 'ask_business_type':
        return `The user wants to start a new business empire called "${project}". Ask what kind of business this will be.`;

      case 'ask_product_type':
        return `The user said: "${userInput}". Ask what products or services this business will offer.`;

      case 'ask_target_customer':
        return `The user said: "${userInput}". Ask who the ideal customer is and what problem the product solves.`;

      case 'ask_supplier_help':
        return `The user said: "${userInput}". Ask if they want help finding suppliers, sourcing products, or tools to build the store.`;

      case 'ask_platform':
        return `The user said: "${userInput}". Recommend 2–3 platforms to sell on (e.g., Shopify, Etsy, Amazon). Ask which one they prefer.`;

      case 'ask_brand':
        return `The user said: "${userInput}". Ask what style or brand tone they envision: luxury, modern, fun, minimal, etc.`;

      case 'build_name':
        return `The user said: "${userInput}". Based on that, suggest 3–5 business names. Ask them to choose one or modify.`;

      case 'next_steps':
        return `The user said: "${userInput}". Summarize the current business setup and ask if they're ready to move to logo design, domain setup, and launch.`;

      default:
        return `The user said: "${userInput}". Continue helping build their "${project}" empire.`;
    }
  };

  useEffect(() => {
    setProjects(getSavedProjects());
    const msgs = loadMessages(selectedProject);
    setMessages(msgs);
    const lastBotMsg = [...msgs].reverse().find(m => m.sender === 'bot' && m.canvas);
    if (lastBotMsg) setCanvasContent(lastBotMsg.canvas);
    if (msgs.length === 0) {
      const firstPrompt = `🧠 FoundryBot: What is your newest empire going to be?`;
      const botMsg = { sender: 'bot', text: firstPrompt };
      const initialMessages = [botMsg];
      setStage('ask_product_type');
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
            <div key={idx} className={`message ${msg.sender}`}>
              {msg.sender === 'user' ? `You: ${msg.text}` : msg.text}
            </div>
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

            const currentStage = getStage();
            const next = nextStage(currentStage);
            const prompt = generateFunnelPrompt(currentStage, input, selectedProject);

            try {
              const res = await fetch('http://localhost:3001/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
              });

              const data = await res.json();
              const botText = `🧠 FoundryBot: ${data.response}`;
              const botMsg = { sender: 'bot', text: botText, canvas: data.response };
              saveMessages([...newMessages, botMsg]);
              setCanvasContent(data.response);
              setStage(next);
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
