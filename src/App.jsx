import React, { useState, useEffect, useRef } from 'react';

const DEFAULT_PROJECT = 'Default Project';

function App() {
  const [input, setInput] = useState('');
  const [selectedProject, setSelectedProject] = useState(DEFAULT_PROJECT);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [canvasContent, setCanvasContent] = useState('');
  const [stageData, setStageData] = useState({});
  const chatEndRef = useRef(null);

  const getStorageKey = (project) => `foundry_chat_${project}`;
  const getStageKey = (project) => `foundry_stage_${project}`;
  const getDataKey = (project) => `foundry_data_${project}`;

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

  const loadStageData = () => {
    const saved = localStorage.getItem(getDataKey(selectedProject));
    return saved ? JSON.parse(saved) : {};
  };

  const saveStageData = (data) => {
    setStageData(data);
    localStorage.setItem(getDataKey(selectedProject), JSON.stringify(data));
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

  const generatePrompt = (stage, data) => {
    switch (stage) {
      case 'ask_business_type':
        return `What kind of business empire do you want to build?`;
      case 'ask_product_type':
        return `You said: "${data.ask_business_type}". What products or services will it offer?`;
      case 'ask_target_customer':
        return `You said: "${data.ask_product_type}". Who is your ideal customer, and what problem are you solving?`;
      case 'ask_supplier_help':
        return `You said: "${data.ask_target_customer}". Would you like help finding suppliers or tools to build your store?`;
      case 'ask_platform':
        return `You said: "${data.ask_supplier_help}". Which platform do you want to sell on (e.g., Shopify, Etsy, Amazon)?`;
      case 'ask_brand':
        return `You said: "${data.ask_platform}". What kind of brand style do you want? (Luxury, modern, fun, minimal)`;
      case 'build_name':
        return `Based on your brand style "${data.ask_brand}", here are some business name ideas. Would you like to pick one or tweak it?`;
      case 'next_steps':
        return `You're almost done! Would you like help designing the logo, getting a domain, and launching the site?`;
      case 'done':
        return `Your empire "${selectedProject}" is ready. Would you like to market it or improve something else?`;
      default:
        return `Let’s keep building your empire.`;
    }
  };

  useEffect(() => {
    setProjects(getSavedProjects());
    const msgs = loadMessages(selectedProject);
    setMessages(msgs);
    setStageData(loadStageData());
    const lastBotMsg = [...msgs].reverse().find(m => m.sender === 'bot' && m.canvas);
    if (lastBotMsg) setCanvasContent(lastBotMsg.canvas);
    if (msgs.length === 0) {
      const firstPrompt = generatePrompt('ask_business_type', {});
      const botMsg = { sender: 'bot', text: `🧠 FoundryBot: ${firstPrompt}` };
      setStage('ask_business_type');
      saveMessages([botMsg]);
    }
  }, [selectedProject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    saveMessages(newMessages);
    setInput('');
    setIsTyping(true);

    const currentStage = getStage();
    const next = nextStage(currentStage);
    const newStageData = { ...stageData, [currentStage]: input };
    saveStageData(newStageData);
    setStage(next);

    const prompt = generatePrompt(next, newStageData);

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
    } catch (err) {
      const errMsg = { sender: 'bot', text: `❌ Failed to fetch AI response.` };
      saveMessages([...newMessages, errMsg]);
    }

    setIsTyping(false);
  };

  return (
    <div className="app">
      <div className="sidebar">
        <h2>FoundryBot</h2>
        <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
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
        <form onSubmit={handleSubmit}>
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
